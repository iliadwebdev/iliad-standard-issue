import { useWatch } from "@iliad.dev/react-standard-issue/hooks";
import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/router";

type SerializerFunction = (value: any) => string | undefined;
type DeserializerFunction = (value: string) => any;

interface Options {
  serializer?: SerializerFunction;
  deserializer?: DeserializerFunction;
}

type A = XOR<"A", "B">;

export function useRouterQueryState<T>(
  name: string,
  defaultValue?: T,
  opts: Options = {}
): [T, Dispatch<SetStateAction<T>>] {
  const router = useRouter();

  const serialize = (value: T): string | undefined => {
    if (opts.serializer) {
      return opts.serializer(value);
    }
    return value as string;
  };

  const deserialize = (value: string): T => {
    if (opts.deserializer) return opts.deserializer(value);

    // default deserializer for number type
    if (typeof defaultValue === "number") {
      const numValue = Number(value === "" ? "r" : value);
      return isNaN(numValue) ? (defaultValue as T) : (numValue as T);
    }
    return value as T;
  };

  const [state, setState] = useState<T>(() => {
    const value = router.query[name];
    if (value === undefined) {
      return defaultValue as T;
    }
    return deserialize(value as string);
  });

  useWatch(() => {
    //! Don't manipulate the query parameter directly
    const serializedState = serialize(state);
    const _q = router.query;

    if (serializedState === undefined) {
      if (router.query[name]) {
        delete _q[name];
        router.query = _q;
      }
    } else {
      _q[name] = serializedState;
      router.query = _q;
    }
    router.push(
      {
        pathname: window.location.pathname,
        query: {
          ..._q,
          [name]: router.query[name],
        },
        hash: window.location.hash,
      },
      undefined,
      { shallow: true }
    );
  }, [state, name]);

  return [state, setState];
}

export default useRouterQueryState;
