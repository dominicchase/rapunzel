export type Game = {
  cover: {
    id: number;
    url: string;
  };
  first_release_date: number;
  genres: { id: number; name: string }[];
  id: number;
  name: string;
  platforms: { id: number; name: string }[];
};
