import { useState } from "react";
import { useZxing } from "react-zxing";

export const BarcodeScanner = () => {
  const [result, setResult] = useState("");
  const { ref } = useZxing({
    onResult(result) {
      setResult(result.getText());
    },
  });

  return (
    <>
      <video ref={ref} className="w-full h-full"/>
      <p>
        <span>Result:</span>
        <span>{result}</span>
      </p>
    </>
  );
};