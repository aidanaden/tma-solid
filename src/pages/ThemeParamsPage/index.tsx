import { useSDK } from "@tma.js/sdk-solid";
import { useNavigate } from "@solidjs/router";

import { Link } from "../../components/Link";
import { DisplayData, Line } from "../../components/DisplayData";

export function ThemeParamsPage() {
  const { themeParams } = useSDK();
  const navigate = useNavigate();
  const lines = (): Line[] => {
    const {
      backgroundColor,
      buttonColor,
      linkColor,
      secondaryBackgroundColor,
      textColor,
      buttonTextColor,
      hintColor,
    } = themeParams();

    return [
      ["Background color", backgroundColor],
      ["Button background color", buttonColor],
      ["Button text color", buttonTextColor],
      ["Link color", linkColor],
      ["Secondary background color", secondaryBackgroundColor],
      ["Text color", textColor],
      ["Hint color", hintColor],
    ];
  };

  return (
    <div class="p-3">
      <Link
        class="pb-3 block"
        href="/init-data"
        onClick={(e) => {
          e.preventDefault();
          navigate(-1);
        }}
      >
        Go back
      </Link>
      <DisplayData title="Theme Params" lines={lines()} />
    </div>
  );
}
