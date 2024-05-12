function HomePage() {
  
  return (
    <div
      id="home"
      className="min-h-screen overflow-x-hidden bg-gradient-to-t from-green-400 via-green-200 to-slate-50"
    >
      <div className="relative mx-16 -mt-8 lg:mt-8 lg:ml-40  mr-32">
        {/* Main Header */}
        <div className="lg:text-6xl md:text-4xl text-2xl text-green-700 font-serif whitespace-nowrap pt-20">
          Laguna Climate Change <br />
          Adaptation and <br />
          Mitigation
        </div>

        {/* Subtitle */}
        <p className="mt-10 lg:text-2xl md:text-2xl font-serif mb-2 text-l font-normal text-black-500">
          Welcome, SuperAdmin!
        </p>


      {/* Image */}
      <div className="flex flex-col mt-20 items-center lg:flex-row lg:justify-end lg:mt-14">
      <div className="lg:-mr-32 mt-0 lg:-mt-80 lg:ml-auto">
    <img
      src="/img/logo/LCCAOlogo2.png"
      alt="Your Image Alt Text"
      className="rounded-3xl object-contain w-full lg:w-4/5 max-w-xl mb-2 opacity-75"
    />
  </div>
</div>

      </div>
   
    </div>
  );
}

export default HomePage;