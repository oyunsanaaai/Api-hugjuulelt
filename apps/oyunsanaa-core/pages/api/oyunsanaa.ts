// apps/oyunsanaa-core/pages/api/oyunsanaa.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { OYUNSANAA_PROMPT } from "../../../prompts/oyunsanaa";

const includes = (s = "", ...keys: string[]) =>
  keys.some(k => s.toLowerCase().includes(k.toLowerCase()));

const greetByAge = (age: string) => {
  switch (age) {
    case "0-7": return "Сайн уу, бяцхан найз минь! 😊";
    case "8-12": return "Сайн уу! Чи их сониуч насан дээрээ байна.";
    case "13-18": return "Сайн уу! Өсвөр нас бол их өөрчлөлтийн үе шүү.";
    case "19-25": return "Сайн уу! Мөрөөдлөө зоригтойгоор төлөвлөе.";
    case "26-40": return "Сайн уу! Чи ид эрч хүчтэй үе дээрээ байна.";
    case "41-55": return "Сайн уу! Туршлагаа өөртөө эелдэгээр ашиглая.";
    case "56-70": return "Сайн уу! Эрүүл мэнддээ анхаарч аядуу хэмнэлээр.";
    default: return "Сайн уу!";
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(200).send("oyunsanaa-core API project is running ✅");
  }

  const { message = "", deep = false, age_category = "" } = req.body || {};
  let reply = "";

  if (includes(message, "сайн уу", "сайнуу", "мэнд", "hello", "hi")) {
    reply = `${greetByAge(age_category)} Би Оюунсанаа. Яг одоо танд юугаар туслах вэ?`;
  }

  if (!reply && includes(message, "таагүй", "урамгүй", "ядар", "стресс", "сэтгэл")) {
    reply =
      "Анзаарлаа. Одоохондоо ганц жижиг алхам хийе: 5 гүн амьсгаа аваад гаргаарай. " +
      "Дараа нь 10 минут алхах эсвэл цэвэр агаар амьсгалбал зүрх тайвширдаг. " +
      "Хэрхэн мэдрэгдэж байна?";
  }

  if (!reply && includes(message, "нойр", "унтах")) {
    reply =
      "Нойр дутмаг байвал өдрийн сүүлд кофеин багасгаж, унтахын өмнө дэлгэцээс 30–60 мин зайлсхийхыг зөвлөе. " +
      "Өнөө орой унтах цагийг нэг тогтмол цагаар тохируулж үзье.";
  }

  if (!reply && includes(message, "мөнгө", "санхүү", "өр")) {
    reply =
      "Санхүүгээ тайван цэгцэлье: 1) 7 хоногийн бүх зардлаа тэмдэглэ. 2) Заавал биш 1 зардлыг түр саатуул. " +
      "3) Жижиг хэмжээтэй ч хуримтлал үүсгэ. Хэрэв хүсвэл би өдөр бүр сануулж дэмжинэ.";
  }

  if (!reply) {
    reply =
      `${greetByAge(age_category)} Би тантай дотно, энгийнээр ярилцаж тусална. ` +
      `Та яг одоо юуг хамгийн түрүүнд сайжруулмаар байна вэ?`;
  }

  if (deep) {
    reply += " (Хэрэв хүсвэл үүнийг жижиг алхамд хуваагаад өдөр бүр сануулж явъя.)";
  }

  return res.status(200).json({
    ok: true,
    meta: {
      hasPrompt: !!OYUNSANAA_PROMPT,
      promptLength: OYUNSANAA_PROMPT.length,
    },
    reply,
  });
}
