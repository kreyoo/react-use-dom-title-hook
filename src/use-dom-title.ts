import { useEffect, useRef, useState } from "react";

// Metadata for active titles
const activeTitlesStack: {
	titleBeforeMount: string;
	count: number;
	title: string;
}[] = [];

interface activeTitlesStackUpdated {
	decremented: number[];
}

type activeTitlesStackUpdatedEvent = CustomEventInit<activeTitlesStackUpdated>;

function removeTitleFromActiveTitles(titleIndex: number): number {
	const { count, titleBeforeMount } = activeTitlesStack[titleIndex];
	if (count > 1) {
		activeTitlesStack[titleIndex].count -= 1;
	} else {
		// If our title is not the last in order, we pass our titleBeforeMount to the next title
		if (titleIndex !== activeTitlesStack.length - 1)
			activeTitlesStack[titleIndex + 1].titleBeforeMount = titleBeforeMount;

		activeTitlesStack.splice(titleIndex, 1);
		const activeTitlesStackUpdated = new CustomEvent<activeTitlesStackUpdated>(
			"activeTitlesStackUpdated",
			{
				detail: {
					decremented: [...Array(activeTitlesStack.length + 1).keys()].filter(
						(index: number) => index > titleIndex
					),
				},
			}
		);
		document.dispatchEvent(activeTitlesStackUpdated);
	}
	return -1;
}

function addTitleToActiveTitles(title: string, titleIndex: number): number {
	if (
		activeTitlesStack.length &&
		titleIndex >= 0 &&
		activeTitlesStack[titleIndex].title !== title
	) {
		removeTitleFromActiveTitles(titleIndex);
		if (activeTitlesStack[activeTitlesStack.length - 1].title === title) {
			activeTitlesStack[activeTitlesStack.length - 1].count++;
		} else {
			activeTitlesStack.push({
				title: title,
				titleBeforeMount: document.title,
				count: 1,
			});
		}
	} else {
		if (
			(activeTitlesStack.length &&
				activeTitlesStack[activeTitlesStack.length - 1].title !== title) ||
			!activeTitlesStack.length
		) {
			activeTitlesStack.push({
				title: title,
				titleBeforeMount: document.title,
				count: 1,
			});
		} else {
			activeTitlesStack[activeTitlesStack.length - 1].count++;
		}
	}

	return activeTitlesStack.length - 1;
}

export default function useDOMTitle(title: string) {
	const [titleIndex, setTitleIndex] = useState(-1);

	const mountedTitle = useRef<string>("");
	useEffect(() => {
		const eventHandler = (e: activeTitlesStackUpdatedEvent) => {
			if (e.detail && e.detail.decremented.includes(titleIndex))
				setTitleIndex((oldIndex: number) => oldIndex - 1);
		};
		if (titleIndex >= 0)
			document.addEventListener("activeTitlesStackUpdated", eventHandler);

		return () => {
			if (titleIndex >= 0) {
				document.removeEventListener("activeTitlesStackUpdated", eventHandler);

				if (
					titleIndex < activeTitlesStack.length &&
					activeTitlesStack[titleIndex].title === mountedTitle.current
				) {
					if (
						activeTitlesStack[titleIndex].count <= 1 &&
						document.title === activeTitlesStack[titleIndex].title
					) {
						document.title = activeTitlesStack[titleIndex].titleBeforeMount;
					}

					removeTitleFromActiveTitles(titleIndex);
				}
			}
		};
	}, [titleIndex]);

	useEffect(() => {
		let newTitle = mountedTitle.current;

		if (
			typeof title === "string" &&
			title.trim().length > 0 &&
			((titleIndex >= 0 &&
				title.trim() !== activeTitlesStack[titleIndex].title) ||
				(titleIndex === -1 && mountedTitle.current !== title.trim()))
		) {
			newTitle = title.trim();

			setTitleIndex(addTitleToActiveTitles(newTitle, titleIndex));
			mountedTitle.current = newTitle;

			document.title = newTitle;
		}
	}, [title]);
}
