import { renderHook } from "@testing-library/react-hooks";
import useDOMTitle from "./use-dom-title";

describe("use-dom-title", () => {
	it("sets given value as document.title", () => {
		renderHook(() => useDOMTitle("mounted"));
		expect(document.title).toBe("mounted");
	});

	it("does not change document.title if called with empty string", () => {
		document.title = "unmounted";
		renderHook(() => useDOMTitle(""));
		expect(document.title).toBe("unmounted");
		renderHook(() => useDOMTitle("  \t\n"));
		expect(document.title).toBe("unmounted");
	});

	it("trims value before setting to document.title", () => {
		renderHook(() => useDOMTitle("  mounted   \t\n"));
		expect(document.title).toBe("mounted");
	});

	it("reverts title after unmount", () => {
		const oldTitle = "Unmounted";
		const newTitle = "Mounted";
		document.title = oldTitle;
		const renderResult = renderHook(() => useDOMTitle(newTitle));
		expect(document.title).toBe(newTitle);
		renderResult.unmount();
		expect(document.title).toBe(oldTitle);
	});

	it("reverts the title if new title is empty", () => {
		document.title = "unmounted";
		const renderResult = renderHook((title: string) => useDOMTitle(title), {
			initialProps: "mounted",
		});
		expect(document.title).toBe("mounted");
		renderResult.rerender("");
		expect(document.title).toBe("unmounted");
		renderResult.rerender("Cool Content");
		expect(document.title).toBe("Cool Content");
		renderResult.rerender("   ");
		expect(document.title).toBe("unmounted");
	});

	it("reverts title after last mounted unmounts", () => {
		const oldTitle = "Unmounted";
		const newTitle = "Mounted";
		document.title = oldTitle;
		const renderer = () => useDOMTitle(newTitle);

		const renderResult1 = renderHook(renderer);
		expect(document.title).toBe(newTitle);
		const renderResult2 = renderHook(renderer, {});
		expect(document.title).toBe(newTitle);
		renderResult1.unmount();
		expect(document.title).toBe(newTitle);
		renderResult2.unmount();
		expect(document.title).toBe(oldTitle);
	});

	it("does work with chained, unique titles", () => {
		const oldTitle = "Unmounted";
		const newTitle = "Mounted";
		const anotherNewTitle = "There is another";
		document.title = oldTitle;
		const newTitleRenderer = () => useDOMTitle(newTitle);
		const anotherNewTitleRenderer = () => useDOMTitle(anotherNewTitle);
		const renderNewResult = renderHook(newTitleRenderer);
		expect(document.title).toBe(newTitle);
		const renderAnotherNewResult = renderHook(anotherNewTitleRenderer);
		expect(document.title).toBe(anotherNewTitle);
		renderNewResult.unmount();
		expect(document.title).toBe(anotherNewTitle);
		renderAnotherNewResult.unmount();
		expect(document.title).toBe(oldTitle);
	});

	it("respects the stack", () => {
		const oldTitle = "Unmounted";
		const newTitle = "Mounted";
		const loadingTitle = "Loading...";
		const loadingRenderer = () => useDOMTitle(loadingTitle);
		document.title = oldTitle;
		renderHook(loadingRenderer);
		expect(document.title).toBe(loadingTitle);
		renderHook(() => useDOMTitle(newTitle));
		expect(document.title).toBe(newTitle);
		const renderResult = renderHook(loadingRenderer);
		expect(document.title).toBe(loadingTitle);
		renderResult.unmount();
		expect(document.title).toBe(newTitle);
	});

	test("one entire setup and teardown", () => {
		document.title = "Unmounted";
		const renderResults = [
			"Loading...",
			"Some Title",
			"Loading...",
			"Loading...",
			"Wow, this is cool!",
			"Loading...",
			"Toasty Buns", // https://www.youtube.com/watch?v=70gtWveVuRg
		].map((val: string) => {
			const renderResult = renderHook(() => useDOMTitle(val));
			expect(document.title).toBe(val);
			return renderResult;
		});

		renderResults[6].unmount();
		expect(document.title).toBe("Loading...");
		renderResults[5].unmount();
		expect(document.title).toBe("Wow, this is cool!");
		renderResults[4].unmount();
		expect(document.title).toBe("Loading...");
		renderResults[3].unmount();
		expect(document.title).toBe("Loading...");
		renderResults[2].unmount();
		expect(document.title).toBe("Some Title");
		renderResults[0].unmount();
		expect(document.title).toBe("Some Title");
		renderResults[1].unmount();
		expect(document.title).toBe("Unmounted");
	});

	test("get on top of stack after re-render with another title", () => {
		document.title = "unmounted";
		const renderResult = renderHook((title: string) => useDOMTitle(title), {
			initialProps: "Mounted",
		});
		const renderResult2 = renderHook((title: string) => useDOMTitle(title), {
			initialProps: "Loading...",
		});

		renderResult.rerender("Toasty Buns");
		expect(document.title).toBe("Toasty Buns");
		renderResult.unmount();
		expect(document.title).toBe("Loading...");
		const renderResult3 = renderHook(() => useDOMTitle("Toasty Buns"));
		expect(document.title).toBe("Toasty Buns");
		renderResult2.rerender("Toasty Buns");
		renderResult3.unmount();
		expect(document.title).toBe("Toasty Buns");
		renderResult2.unmount();
		expect(document.title).toBe("unmounted");
	});
});
