import { ExclamationIcon } from "@heroicons/react/outline";

import Card from "@/components/Card";
import { useFavorites } from "@/hooks";
import { PrismaTypes } from "@/lib/prisma";

const Grid = ({
  homes = [],
  showOnlyFavourites = false,
}: {
  homes: PrismaTypes.HomeMaxAggregateOutputType[];
  showOnlyFavourites?: boolean;
}) => {
  const isEmpty = homes.length === 0;

  const { favorites, isLoading, toggleFavorite } = useFavorites();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isEmpty ? (
    <p className="text-amber-700 bg-amber-100 px-4 rounded-md py-2 max-w-max inline-flex items-center space-x-1">
      <ExclamationIcon className="shrink-0 w-5 h-5 mt-px" />
      <span>Unfortunately, there is nothing to display yet.</span>
    </p>
  ) : (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {homes
        ?.filter((x: PrismaTypes.HomeMaxAggregateOutputType) => {
          if (showOnlyFavourites) {
            return favorites?.includes(String(x?.id));
          }
          return x;
        })
        .map((home) => (
          <Card
            key={home?.id}
            {...home}
            onClickFavorite={toggleFavorite}
            favorite={
              !!favorites.find((favoriteId: string) => favoriteId === home.id)
            }
          />
        ))}
    </div>
  );
};

export default Grid;
