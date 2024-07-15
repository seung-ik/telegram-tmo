import APPLE from "./fruit/APPLE.png";
import AVOCADO from "./fruit/AVOCADO.png";
import BLUEBERRY from "./fruit/BLUEBERRY.png";
import COCONUT from "./fruit/COCONUT.png";
import GOLDWATERMELON from "./fruit/GOLDWATERMELON.png";
import MELON from "./fruit/MELON.png";
import PEACH from "./fruit/PEACH.png";
import STRAWBERRY from "./fruit/STRAWBERRY.png";
import TANGERINE from "./fruit/TANGERINE.png";
import TOMATO from "./fruit/TOMATO.png";
import WATERMELON from "./fruit/WATERMELON.png";
import KOREANMELON from "./fruit/KOREANMELON.png";
import { Fruit } from "../object/Fruit";
import CARD_0 from "./slotGame/image_0.png";
import CARD_1 from "./slotGame/image_1.png";
import CARD_2 from "./slotGame/image_2.png";
import CARD_3 from "./slotGame/image_3.png";
import CARD_4 from "./slotGame/image_4.png";
import CARD_5 from "./slotGame/image_5.png";
import CARD_6 from "./slotGame/image_6.png";
import CARD_7 from "./slotGame/image_7.png";

export const FruitImg: { [key in Fruit]: string } = {
  APPLE,
  AVOCADO,
  BLUEBERRY,
  COCONUT,
  GOLDWATERMELON,
  MELON,
  PEACH,
  STRAWBERRY,
  TANGERINE,
  TOMATO,
  WATERMELON,
  KOREANMELON,
};

// export enum Fruit {
//   BLUEBERRY = "BLUEBERRY",
//   STRAWBERRY = "STRAWBERRY",
//   TANGERINE = "TANGERINE",
//   TOMATO = "TOMATO",
//   AVOCADO = "AVOCADO",
//   KOREANMELON = "KOREANMELON",
//   APPLE = "APPLE",
//   PEACH = "PEACH",
//   COCONUT = "COCONUT",
//   MELON = "MELON",
//   WATERMELON = "WATERMELON",
//   GOLDWATERMELON = "GOLDWATERMELON",
// }

export const CardImg = {
  CARD_0,
  CARD_1,
  CARD_2,
  CARD_3,
  CARD_4,
  CARD_5,
  CARD_6,
  CARD_7,
} as const;

export type CardKey = keyof typeof CardImg;
