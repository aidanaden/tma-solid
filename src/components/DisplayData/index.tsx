import { For, Match, Switch } from "solid-js";
import { isRGB, type RGB } from "@tma.js/colors";

type LineValue = string | null | Line[];
export type Line = [title: string, value: LineValue];

interface DisplayDataProps {
  title: string;
  lines: Line[];
}

interface DataLineProps {
  title: string;
  value: LineValue;
}

interface DisplayRGBProps {
  color: RGB;
}

function DisplayRGB(props: DisplayRGBProps) {
  return (
    <div class="flex items-center">
      {/* .color {
        border-radius: 50%;
      } */}
      <div
        class="w-[18px] aspect-square border border-[#555] rounded-full mr-1"
        style={{ "background-color": props.color }}
      />
      {props.color}
    </div>
  );
}

function DataLine(props: DataLineProps) {
  return (
    <div class="pb-4">
      <Switch>
        <Match when={Array.isArray(props.value) ? props.value : false}>
          {(lines) => <DisplayData title={props.title} lines={lines()} />}
        </Match>
        <Match when={true}>
          <div class="font-bold pb-1 text-lg">{props.title}</div>
          <div class="whitespace-normal break-words">
            <code>
              <Switch fallback={<i>No data</i>}>
                <Match
                  when={
                    typeof props.value === "string" && isRGB(props.value)
                      ? props.value
                      : false
                  }
                >
                  {(rgb) => <DisplayRGB color={rgb()} />}
                </Match>
                <Match
                  when={typeof props.value === "string" ? props.value : false}
                >
                  {(stringValue) => stringValue()}
                </Match>
              </Switch>
            </code>
          </div>
        </Match>
      </Switch>
    </div>
  );
}

export function DisplayData(props: DisplayDataProps) {
  return (
    <div class="text-base text-tg-text">
      <div class="font-bold text-3xl pb-3">{props.title}</div>
      <For each={props.lines}>
        {([title, value]) => <DataLine title={title} value={value} />}
      </For>
    </div>
  );
}
