import axios from "axios";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useFavorites = () => {
  const { status } = useSession();

  const { data, error, mutate } = useSWR(
    status === "authenticated" ? `/api/user/favorites` : null,
    fetcher
  );

  const toggleFavorite = async (id: string) => {
    return mutate(
      async (favorites: string[]) => {
        try {
          toast.dismiss("updateFavorite");

          const isFavorite = favorites.find((favoriteId) => favoriteId === id);
          if (isFavorite) {
            axios.delete(`/api/homes/${id}/favorite`);
            return favorites.filter((favoriteId) => favoriteId !== id);
          } else {
            axios.put(`/api/homes/${id}/favorite`);
            return [...favorites, id];
          }
        } catch (e) {
          toast.error("Unable to update favorite", { id: "updateFavorite" });
        }
      },
      { revalidate: false }
    );
  };

  return {
    favorites: data || [],
    isLoading: !error && !data && status !== "unauthenticated",
    isError: error,
    toggleFavorite,
  };
};
