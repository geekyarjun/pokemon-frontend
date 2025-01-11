import AnimationLoader from "../assets/pokemon_animation_loader.gif";

const Loader = () => {
  return (
    <div className="h-screen w-screen relative">
      <img
        src={AnimationLoader}
        alt="loader"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
};

export default Loader;
