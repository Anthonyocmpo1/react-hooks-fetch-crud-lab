import React from "react";
import "whatwg-fetch";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { server } from "../mocks/server";
import { act } from "react-dom/test-utils";
import App from "../components/App";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("displays question prompts after fetching", async () => {
  render(<App />);

  await act(async () => {
    fireEvent.click(screen.queryByText(/View Questions/));

    expect(await screen.findByText(/lorem testum 1/g)).toBeInTheDocument();
    expect(await screen.findByText(/lorem testum 2/g)).toBeInTheDocument();
  });
});

test("creates a new question when the form is submitted", async () => {
  render(<App />);

  await act(async () => {
    // wait for first render of list
    await screen.findByText(/lorem testum 1/g);

    // navigate to the form
    fireEvent.click(screen.queryByText("New Question"));

    // fill out form
    fireEvent.change(screen.queryByLabelText(/Prompt/), {
      target: { value: "Test Prompt" },
    });
    fireEvent.change(screen.queryByLabelText(/Answer 1/), {
      target: { value: "Test Answer 1" },
    });
    fireEvent.change(screen.queryByLabelText(/Answer 2/), {
      target: { value: "Test Answer 2" },
    });
    fireEvent.change(screen.queryByLabelText(/Correct Answer/), {
      target: { value: "1" },
    });

    // submit form
    fireEvent.submit(screen.queryByText(/Add Question/));

    // view questions
    fireEvent.click(screen.queryByText(/View Questions/));

    expect(await screen.findByText(/Test Prompt/g)).toBeInTheDocument();
    expect(await screen.findByText(/lorem testum 1/g)).toBeInTheDocument();
  });
});

test("deletes the question when the delete button is clicked", async () => {
  const { rerender } = render(<App />);

  await act(async () => {
    fireEvent.click(screen.queryByText(/View Questions/));

    await screen.findByText(/lorem testum 1/g);

    fireEvent.click(screen.queryAllByText("Delete Question")[0]);

    await waitForElementToBeRemoved(() => screen.queryByText(/lorem testum 1/g));

    rerender(<App />);

    await screen.findByText(/lorem testum 2/g);

    expect(screen.queryByText(/lorem testum 1/g)).not.toBeInTheDocument();
  });
});

test("updates the answer when the dropdown is changed", async () => {
  const { rerender } = render(<App />);

  await act(async () => {
    fireEvent.click(screen.queryByText(/View Questions/));

    await screen.findByText(/lorem testum 2/g);

    // Change dropdown value
    fireEvent.change(screen.queryAllByLabelText(/Correct Answer/)[0], {
      target: { value: "3" },
    });

    // Wait for dropdown to reflect new value
    await waitFor(() => {
      expect(screen.queryAllByLabelText(/Correct Answer/)[0].value).toBe("3");
    });

    rerender(<App />);

    // Final check after rerender
    expect(screen.queryAllByLabelText(/Correct Answer/)[0].value).toBe("3");
  });
});
