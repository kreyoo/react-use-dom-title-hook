import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { v4 as uuidv4 } from "uuid";

interface DOMTitleComponentData {
  uuid: string;
  title: string;
  titleBeforeMount: string;
}

interface DOMTitleRegisterEventData extends DOMTitleComponentData {
  myRef: MutableRefObject<DOMTitleComponentData | undefined>;
}

type DOMTitleRegisterEventDetail = CustomEventInit<DOMTitleRegisterEventData>;

interface DOMTitleUnregisterEventData extends DOMTitleComponentData {
  beforeMe?: DOMTitleComponentData;
  behindMe?: DOMTitleComponentData;
}

type DOMTitleUnregisterEventDetail =
  CustomEventInit<DOMTitleUnregisterEventData>;

function checkIfSameUUID<T extends DOMTitleComponentData>(
  a?: T,
  b?: T,
): boolean {
  return !!a && !!b && a.uuid === b.uuid;
}

const registerDOMTitle = "registerDOMTitle";
const unregisterDOMTitle = "unregisterDOMTitle";

let uuidStore: string[] = [];

export function useDOMTitle(title: string) {
  const uuid = useRef(uuidv4());
  const mountedTitle = useRef("");
  const titleBeforeMount = useRef("");
  const behindMe = useRef<DOMTitleComponentData>();
  const beforeMe = useRef<DOMTitleComponentData>();
  const iAmLast = useRef(true);

  const newUnregisterEvent = useCallback(
    () =>
      new CustomEvent<DOMTitleUnregisterEventData>(unregisterDOMTitle, {
        detail: {
          beforeMe: beforeMe.current,
          behindMe: behindMe.current,
          uuid: uuid.current,
          title: mountedTitle.current,
          titleBeforeMount: titleBeforeMount.current,
        },
      }),
    [],
  );

  const revertTitle = useCallback(() => {
    if (
      document.title === mountedTitle.current &&
      (!beforeMe.current ||
        (beforeMe.current &&
          beforeMe.current.title !== mountedTitle.current)) &&
      !behindMe.current
    )
      document.title = titleBeforeMount.current;
  }, []);

  const register = useCallback((title: string) => {
    if (typeof title === "string") {
      const trimmed = title.trim();

      let registerAllowed =
        mountedTitle.current && !uuidStore.includes(uuid.current);

      if (!trimmed || (trimmed && mountedTitle.current !== trimmed)) {
        document.dispatchEvent(newUnregisterEvent());
        revertTitle();

        mountedTitle.current = "";

        titleBeforeMount.current = "";
        behindMe.current = undefined;
        beforeMe.current = undefined;
        iAmLast.current = true;
        if (trimmed) registerAllowed = true;
        uuidStore = uuidStore.filter((val: string) => val !== uuid.current);
      }

      if (trimmed && mountedTitle.current !== trimmed && registerAllowed) {
        titleBeforeMount.current = document.title;

        mountedTitle.current = trimmed;

        document.title = trimmed;
        if (!uuidStore.includes(uuid.current)) {
          uuidStore.push(uuid.current);

          const registerEvent = new CustomEvent<DOMTitleRegisterEventData>(
            registerDOMTitle,
            {
              detail: {
                uuid: uuid.current,
                titleBeforeMount: titleBeforeMount.current,
                title: mountedTitle.current,
                myRef: beforeMe,
              },
            },
          );
          document.dispatchEvent(registerEvent);
        }
      }
    }
  }, []);

  const isMe = useCallback(
    (other?: DOMTitleComponentData) =>
      mountedTitle.current &&
      uuid.current &&
      checkIfSameUUID(
        {
          title: mountedTitle.current,
          uuid: uuid.current,
          titleBeforeMount: titleBeforeMount.current,
        },
        other,
      ),

    [],
  );

  useEffect(() => {
    const handleRegister = (e: DOMTitleRegisterEventDetail) => {
      if (iAmLast.current && e.detail && e.detail.uuid !== uuid.current) {
        iAmLast.current = false;
        behindMe.current = e.detail;

        e.detail.myRef.current = {
          uuid: uuid.current,
          title: mountedTitle.current,
          titleBeforeMount: titleBeforeMount.current,
        };
      }
    };

    const handleUnregister = (e: DOMTitleUnregisterEventDetail) => {
      if (e.detail && e.detail.uuid !== uuid.current) {
        if (
          isMe(e.detail.beforeMe) &&
          checkIfSameUUID(behindMe.current, e.detail)
        ) {
          behindMe.current = e.detail.behindMe;
          if (!behindMe.current) iAmLast.current = true;
        } else if (
          isMe(e.detail.behindMe) &&
          checkIfSameUUID(beforeMe.current, e.detail)
        ) {
          beforeMe.current = e.detail.beforeMe;
          titleBeforeMount.current = e.detail.titleBeforeMount;
        }
      }
    };

    document.addEventListener(registerDOMTitle, handleRegister);
    document.addEventListener(unregisterDOMTitle, handleUnregister);
    return () => {
      document.removeEventListener(registerDOMTitle, handleRegister);
      document.removeEventListener(unregisterDOMTitle, handleUnregister);

      revertTitle();

      document.dispatchEvent(newUnregisterEvent());
      uuidStore = uuidStore.filter((val: string) => val !== uuid.current);
    };
  }, []);

  useMemo(() => {
    register(title);
  }, []);

  useEffect(() => {
    register(title);
  }, [title]);
}

export default useDOMTitle;
