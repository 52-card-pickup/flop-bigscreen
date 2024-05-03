import { Transition } from "solid-transition-group";
import { CardSuite, CardValue } from "../signals/createClient";
import { Accessor } from "solid-js";

export function FlipCard({
  suite,
  value,
  key,
  flipped,
}: {
  suite: CardSuite;
  value: CardValue;
  key?: number;
  flipped?: Accessor<boolean>;
}) {
  return (
    <div class="flex justify-center items-center relative h-full group">
      <div
        classList={{
          "absolute top-0 left-0 w-full h-full transition delay-500 duration-300 ease-in-out [backface-visibility:hidden]":
            true,
          "[transform:rotateY(0deg)]": !flipped(),
          "[transform:rotateY(180deg)]": flipped(),
        }}
      >
        <Card suite={suite} value={value} key={key} />
      </div>
      <div
        classList={{
          "relative transition delay-500 duration-300 ease-in-out [backface-visibility:hidden]":
            true,
          "[transform:rotateY(180deg)]": !flipped(),
          "[transform:rotateY(360deg)]": flipped(),
        }}
      >
        <CardBackFace key={key} />
      </div>
    </div>
  );
}

// export function FlipCard({
//   suite,
//   value,
//   key,
//   flipped,
// }: {
//   suite: CardSuite;
//   value: CardValue;
//   key?: number;
//   flipped?: boolean;
// }) {
//   return (
//     <div class="flex justify-center items-center relative h-full">
//       {/* <Transition
//         enterActiveClass="transition duration-300 ease-in-out"
//         enterClass="[transform:rotateY(180deg)]"
//         enterToClass="[transform:rotateY(0deg)]"
//         exitActiveClass="transition duration-300 ease-in-out"
//         exitClass="[transform:rotateY(0deg)]"
//         exitToClass="[transform:rotateY(180deg)]"
//       > */}
//       <div class="absolute top-0 left-0 w-full h-full [backface-visibility:hidden] transition duration-300 ease-in-out [transform:rotateY(0deg)] group:[transform:rotateY(180deg)]">
//         <Card suite={suite} value={value} key={key} />
//       </div>
//       {/* </Transition> */}
//       {/* <Transition
//         enterActiveClass="transition duration-300 ease-in-out"
//         enterClass="[transform:rotateY(360deg)] opacity-100"
//         enterToClass="[transform:rotateY(180deg)] opacity-20"
//         exitActiveClass="transition duration-300 ease-in-out"
//         exitClass="[transform:rotateY(180deg)]"
//         exitToClass="[transform:rotateY(360deg)]"
//       > */}
//       <div class="relative [backface-visibility:hidden] transition duration-300 ease-in-out [transform:rotateY(180deg)] group:[transform:rotateY(360deg)]">
//         <CardBackFace key={key} />
//       </div>
//       {/* </Transition> */}
//     </div>
//   );
// }

export function Card({
  suite,
  value,
  key,
  variant,
}: {
  suite: CardSuite;
  value: CardValue;
  key?: number;
  variant?: "small" | "large";
}) {
  if (variant === "small") {
    return (
      <span
        role="img"
        aria-label="card"
        class="bg-white px-1 py-2 rounded-sm text-2xl w-fit justify-self-center font-medium"
      >
        <ValueCharacter value={value} />
        <SuitEmoji suit={suite} />
      </span>
    );
  }
  return (
    <img
      src={`/cards/${suite}_${value}.svg`}
      alt={`${value} of ${suite}`}
      class="h-full"
      data-key={key}
    />
  );
}

export function CardBackFace({ key }: { key?: number }) {
  return (
    <img
      src="/cards/back_blue2.svg"
      alt="card back"
      class="h-full"
      data-key={key}
    />
  );
}

function SuitEmoji({ suit }: { suit: string }) {
  switch (suit) {
    case "hearts":
      return (
        <span role="img" aria-label="hearts" class="text-[#ff0000]">
          ♥️
        </span>
      );
    case "diamonds":
      return (
        <span role="img" aria-label="diamonds" class="text-[#ff0000]">
          ♦️
        </span>
      );
    case "clubs":
      return (
        <span role="img" aria-label="clubs" class="text-black">
          ♣️
        </span>
      );
    case "spades":
      return (
        <span role="img" aria-label="spades" class="text-black">
          ♠️
        </span>
      );
    default:
      return null;
  }
}

function ValueCharacter({ value }: { value: CardValue }) {
  switch (value) {
    case "ace":
      return "A";
    case "king":
      return "K";
    case "queen":
      return "Q";
    case "jack":
      return "J";
    default:
      return value;
  }
}
