import { Progress } from "@/components/ui/progress";
import { formatStatName } from "@/lib/utils";
import { type Pokemon } from "@/types/api";

const PokemonDialog = (props: Pokemon) => {
  const { name, sprites, types, abilities, stats, height, weight } = props;
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="flex flex-col items-center">
          <div className="flex gap-4">
            <img
              src={sprites.front_default}
              alt={`${name} front`}
              className="w-40 h-40"
            />
            {sprites.back_default && (
              <img
                src={sprites.back_default}
                alt={`${name} back`}
                className="w-40 h-40"
              />
            )}
          </div>

          <div className="flex gap-2 mt-4 flex-wrap justify-center">
            {types.map((type) => (
              <span
                key={type}
                className="px-4 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Abilities</h3>
            <div className="space-y-2">
              {abilities.map((ability) => (
                <div
                  key={ability.ability.name}
                  className="flex items-center gap-2"
                >
                  <span className="capitalize">{ability.ability.name}</span>
                  {ability.is_hidden && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      Hidden
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Base Stats</h3>
            <div className="space-y-2">
              {stats.map((stat) => (
                <div key={stat.stat.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{formatStatName(stat.stat.name)}</span>
                    <span className="font-semibold">{stat.base_stat}</span>
                  </div>
                  <Progress value={70} className="[&>div]:bg-blue-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Height</h3>
              <p>{(height / 10).toFixed(1)} m</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Weight</h3>
              <p>{(weight / 10).toFixed(1)} kg</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PokemonDialog;
