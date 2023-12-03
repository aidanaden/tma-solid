import { useNavigate } from "@solidjs/router";
import { useThemeParams } from "@tma.js/sdk-solid";
import { createMemo } from "solid-js";

import { DisplayData, Line } from "../../components/DisplayData";
import { Link } from "../../components/Link";
import { PageLayout } from "../../components/PageLayout";

export function ThemeParamsPage() {
  const themeParams = useThemeParams();
  const navigate = useNavigate();
  const lines = createMemo<Line[]>(() => {
    return [
      ["Background color", themeParams().backgroundColor],
      ["Button background color", themeParams().buttonColor],
      ["Button text color", themeParams().buttonTextColor],
      ["Link color", themeParams().linkColor],
      ["Secondary background color", themeParams().secondaryBackgroundColor],
      ["Text color", themeParams().textColor],
      ["Hint color", themeParams().hintColor],
    ];
  });

  return (
    <PageLayout>
      <Link
        class="block pb-3"
        href="/init-data"
        onClick={(e) => {
          e.preventDefault();
          navigate(-1);
        }}
      >
        Go back
      </Link>
      <DisplayData title="Theme Params" lines={lines()} />
    </PageLayout>
  );
}
