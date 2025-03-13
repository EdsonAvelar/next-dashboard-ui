// lib/dayjs.ts
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extende o dayjs com os plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Define o fuso horário padrão para Brasília
dayjs.tz.setDefault("America/Sao_Paulo");

export default dayjs;
