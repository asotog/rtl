export const SERVER_PORT = parseInt(process.env.SERVER_PORT || "3000");
export const SHOWS_API_URL = 'http://api.tvmaze.com/shows';
export const SHOWS_CAST_API_URL = (id: number) => `/shows/${id}/cast`;
export const DATABASE_PATH = 'shows';
export const PAGE_SIZE = 10;
