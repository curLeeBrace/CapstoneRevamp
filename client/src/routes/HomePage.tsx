function HomePage() {
  return (



    <div id="home" className="bg-gray-200 flex flex-wrap justify-around">

      <div className="flex flex-col gap-5 w-full xl:w-1/2 px-5">
        {/* Main Header */}
        <div className=" text-4xl lg:text-6xl text-green-700 font-serif whitespace-nowrap pt-20 text-wrap">
          Laguna Climate Change 
          Adaptation and 
          Mitigation
        </div>

        {/*Future Video Tutorial*/}

        <div className="bg-black">
          <iframe
            src="https://www.youtube.com/embed/GSpZ4yE046E"
            className="w-full h-96"
            allowFullScreen
          ></iframe>
        </div>

      </div>
        {/* Image */}
        <div className="self-center hidden xl:block">
            <img
              src="/img/logo/LCCAOlogo2.png"
              alt="Your Image Alt Text"
              className="rounded-3xl object-contain w-full lg:w-4/5 max-w-xl mb-2 opacity-75"
            />
       
        </div>
    </div>
  );
}

export default HomePage;
