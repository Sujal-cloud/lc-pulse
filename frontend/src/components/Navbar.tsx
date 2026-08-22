function Navbar() {
  return (
    <nav className="
      sticky
      top-0
      z-50
      border-b
      border-gray-800
      bg-black/40
      backdrop-blur-xl
    ">

      <div className="
        px-6
        py-4
        flex
        justify-between
        items-center
      ">


        <div>

          <h1 className="
            text-xl
            font-bold
            bg-gradient-to-r
            from-white
            to-gray-400
            bg-clip-text
            text-transparent
          ">
            LC Pulse
          </h1>


          <p className="
            text-xs
            text-gray-500
            mt-1
          ">
            Learning Intelligence Platform
          </p>


        </div>





        <div className="
          flex
          items-center
          gap-5
        ">


          <div className="
            flex
            items-center
            gap-2
            text-sm
            text-gray-400
          ">

            <span className="
              h-2
              w-2
              rounded-full
              bg-green-400
            "/>

            Live Analytics

          </div>





          <div className="
            text-sm
            text-gray-300
            border
            border-gray-800
            rounded-lg
            px-3
            py-1.5
          ">
            Dashboard
          </div>


        </div>


      </div>


    </nav>
  );
}

export default Navbar;