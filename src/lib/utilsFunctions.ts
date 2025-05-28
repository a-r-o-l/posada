import { customAlphabet } from "nanoid";

export function priceParserToString(price: number): string {
  if (!price || price === 0) {
    return "0.00";
  } else {
    return price.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}

export function priceParserToInt(price: string): number {
  if (!price || price === "0.00") {
    return 0;
  } else {
    return parseFloat(price);
  }
}

export function priceParser(price: string): string {
  if (!price || price === "0.00") {
    return "0.00";
  } else {
    return parseFloat(price).toFixed(2);
  }
}

export function nameParser(name: string, uppercase?: boolean) {
  if (!!name) {
    if (uppercase) {
      return name.toUpperCase();
    } else {
      const nameArray = name.split(" ");
      const parsedName = nameArray.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      });
      return parsedName.join(" ");
    }
  }
  return "";
}

export function initialsParser(name: string): string {
  if (!!name) {
    const nameArray = name.split(" ");
    const initials = nameArray.map((word) => word.charAt(0).toUpperCase());
    return initials.join("");
  }
  return "";
}

export const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-3);
  const random = Math.floor(Math.random() * 90000) + 10000;
  return timestamp + random.toString();
};

export const paymentStateParser = (state: string) => {
  switch (state) {
    case "approved":
      return { text: "Pagado", color: "bg-green-500" };
    case "pending":
      return { text: "Pendiente", color: "bg-blue-500" };
    case "rejected":
      return { text: "Rechazado", color: "bg-red-500" };
    case "cancelled":
      return { text: "Cancelado", color: "bg-red-500" };
    case "failed":
      return { text: "Rechazado", color: "bg-red-500" };
    default:
      return { text: "", color: "" };
  }
};

export const generateRandomNumber = (length: number = 12) => {
  const numericAlphabet = "0123456789";
  const generateNumericId = customAlphabet(numericAlphabet, length);
  const orderId = generateNumericId();
  return orderId;
};
