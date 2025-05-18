import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../store";
import { PostForm } from "../components/PostForm";
import { PostInput } from "../lib/zodSchemas";
import type { AppDispatch } from "../store";

// ✅ Мокаем createPost, типизировано
jest.mock("../store/postsSlice", () => ({
  ...jest.requireActual("../store/postsSlice"),
  createPost: (data: PostInput) => {
    return async (dispatch: AppDispatch) => {
      dispatch({
        type: "posts/create/fulfilled",
        payload: { id: "mock-id", ...data },
      });
      return { payload: { id: "mock-id", ...data } };
    };
  },
}));

describe("PostForm", () => {
  it("рендерит и отправляет форму", async () => {
    render(
      <Provider store={store}>
        <PostForm />
      </Provider>
    );

    const titleInput = screen.getByPlaceholderText("Заголовок");
    const contentInput = screen.getByPlaceholderText("Содержание");
    const submitBtn = screen.getByRole("button", { name: /создать пост/i });

    fireEvent.change(titleInput, { target: { value: "Test" } });
    fireEvent.change(contentInput, { target: { value: "Content here" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(titleInput).toHaveValue("");
      expect(contentInput).toHaveValue("");
    });
  });

  it("показывает ошибку валидации", async () => {
    render(
      <Provider store={store}>
        <PostForm />
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /создать пост/i }));

    expect(await screen.findByText(/минимум 3 символа/i)).toBeInTheDocument();
  });
});
