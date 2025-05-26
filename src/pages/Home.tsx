import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";

const Home = () => {
  const handleGenerate = () => {
    window.api.sayHello();
  };

  return (
    <div className="home">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <p>Welcome to your Electron app built with Vite and React!</p>
        <button onClick={handleGenerate}>Send hello to main process</button>
      </div>
    </div>
  );
};

export default Home;
