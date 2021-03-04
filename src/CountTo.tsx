import { useRef, useEffect } from "react";
import Countup from "react-countup";

export default function CountTo(props: { number: number; end: number }) {
  const prevValueRef = useRef();
  useEffect(() => {
    prevValueRef.current = props.end;
  });

  return (
    <>
      <CountUp />
    </>
  );
}
