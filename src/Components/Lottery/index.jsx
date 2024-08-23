import { useEffect, useState } from "react";
import "./style.css";
import { AiOutlinePlusCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import "animate.css";
import CountUp from "react-countup";

function Lottery() {
  const [yourLotto, setYourLotto] = useState(["", "", "", "", "", "", ""]);
  const [randomLotto, setRandomLotto] = useState(["", "", "", ""]);
  const [bet, setBet] = useState("");
  const [balance, setBalance] = useState(10000);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [greenBallArray, setGreenBallArray] = useState([]);
  const [profit, setProfit] = useState(0);
  const [lastProfit, setLastProfit] = useState(0);
  const [animate, setAnimate] = useState("p");
  const [prevBalance, setPrevBalance] = useState(balance);
  const [prevProfit, setPrevProfit] = useState(0);
  const [displayHelp, setDisplayHelp] = useState("none");
  const [cross, setCross] = useState("");
  const [remLap, setRemLap] = useState(0);
  const [timeOut, setTimeOut] = useState(1000);
  const [fontSize, setFontSize] = useState(35);

  const handleLotto = (index, value) => {
    let updatedLotto = [...yourLotto];
    updatedLotto[index] = Number(value);
    setYourLotto(updatedLotto);
  };

  const handleProfit = () => {
    if (greenBallArray.length === 1) {
      setPrevProfit(profit);
      setProfit(bet * (4 / 10));
      setLastProfit(bet * (4 / 10));
    } else if (greenBallArray.length === 2) {
      setPrevProfit(profit);
      setProfit(bet * 2);
      setLastProfit(bet * (16 / 10));
    } else if (greenBallArray.length === 3) {
      setPrevProfit(profit);
      setProfit(bet * 8);
      setLastProfit(bet * (60 / 10));
    } else if (greenBallArray.length === 4) {
      setPrevProfit(profit);
      setProfit(bet * 25);
      setLastProfit(bet * (170 / 10));
    } else setProfit(0);
  };

  const handleRandomNumber = () => {
    const randomYourLotto = [...yourLotto];
    const usedNumbers = [];

    for (let i = 0; i < yourLotto.length; i++) {
      let temp = Math.floor(Math.random() * 25) + 1;

      while (randomYourLotto.includes(temp) || usedNumbers.includes(temp)) {
        temp = Math.floor(Math.random() * 25) + 1;
      }

      randomYourLotto[i] = temp;
      usedNumbers.push(temp);
    }

    setYourLotto(randomYourLotto);
  };

  const startLottery = async () => {
    if (
      bet >= 10 &&
      bet <= 100000 &&
      yourLotto.filter((ball) => ball !== "").length === 7 &&
      yourLotto.filter((ball) => ball > 0 && ball < 26).length === 7 &&
      balance >= bet * cross &&
      isSame() !== true &&
      cross >= 1 &&
      cross <= 50
    ) {
      setButtonDisable(true);

      setRemLap((prev) => Number(prev + cross));

      getMainLotto();
    }
  };

  const getMainLotto = async () => {
    const mainLottoLoop = async () => {
      setPrevBalance(balance);
      setBalance((prevBalance) => prevBalance - bet);
      console.log(prevBalance);

      for (let i = 0; i < randomLotto.length; i++) {
        await new Promise((resolve) => {
          setTimeout(() => {
            setRandomLotto((prevLotto) => {
              const updatedLotto = [...prevLotto];
              let temp = Math.floor(Math.random() * 25) + 1;
              while (updatedLotto.includes(temp)) {
                temp = Math.floor(Math.random() * 25) + 1;
              }
              updatedLotto[i] = temp;
              return updatedLotto;
            });
            if (i === randomLotto.length - 1) {
              setTimeout(resolve, 1500); // Son topun çekilmesinden sonra 1,5 saniye beklet
            } else {
              resolve();
            }
          }, 1000);
        });
      }

      await setLastProfit(0);
      setPrevProfit(0);
      setProfit(0);
      setGreenBallArray([]);
      setLastProfit(0);
      setYourLotto(["", "", "", "", "", "", ""]);
      setRandomLotto(["", "", "", ""]);
      handleRandomNumber();
      setRemLap((prev) => Number(prev - 1));
    };

    for (let t = 1; t <= cross; t++) {
      await mainLottoLoop();
    }

    if (remLap === 0) {
      setTimeout(() => {
        setYourLotto(["", "", "", "", "", "", ""]);
        setRandomLotto(["", "", "", ""]);
        setLastProfit(0);
        setGreenBallArray([]);
        setButtonDisable(false);
        setPrevProfit(0);
        setProfit(0);
        setBet("");
        setCross(1);
      }, 2000);
    }
  };

  const getGreenBall = () => {
    const updatedGreenBallArray = [];

    for (let i = 0; i < yourLotto.length; i++) {
      for (let j = 0; j < randomLotto.length; j++) {
        if (
          randomLotto[j] === yourLotto[i] &&
          randomLotto[j] !== "" &&
          yourLotto[i] !== ""
        ) {
          updatedGreenBallArray.push(yourLotto[i]);
          break;
        }
      }
    }

    setGreenBallArray(updatedGreenBallArray);
  };

  const isSame = () => {
    const counts = {}; // Sayıların tekrar sayısını depolamak için bir obje oluşturulur

    for (let i = 0; i < yourLotto.length; i++) {
      const ball = yourLotto[i];

      if (counts[ball]) {
        // Eğer sayı zaten obje içinde tanımlıysa, tekrar sayısını artırır
        counts[ball]++;
      } else {
        // Eğer sayı obje içinde tanımlı değilse, tekrar sayısını 1 olarak ayarlar
        counts[ball] = 1;
      }

      if (counts[ball] >= 2) {
        // Eşleşme durumu olduğunda true döndürür
        return true;
      }
    }

    // Eşleşme durumu yoksa false döndürür
    return false;
  };

  useEffect(() => {
    setPrevBalance(balance);
    setBalance(balance + lastProfit);
    if (profit !== 0 && profit !== "") {
      setAnimate("animate__animated animate__heartBeat");
    }
    setTimeout(() => {
      setAnimate("p");
    }, 500);
  }, [profit]);

  useEffect(() => {
    getGreenBall();
  }, [randomLotto]);

  useEffect(() => {
    handleProfit();
    if (greenBallArray.length === 0) {
      setFontSize(25);
    }

    setFontSize(25 + greenBallArray.length * 10);
  }, [greenBallArray]);

  const handleHelpCard = () => {
    setDisplayHelp("");
  };

  const handleCloseHelpCard = (e) => {
    if (e.target.id === "close-bg") {
      setDisplayHelp("none");
    }
  };

  useEffect(() => {
    const savedBalance = localStorage.getItem("balance");
    if (savedBalance) {
      setBalance(Number(savedBalance));
      setPrevBalance(Number(savedBalance));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("balance", balance);
  }, [balance]);

  const handleCross = (e) => {
    setCross(Number(e.target.value));
  };

  return (
    <div className="container">
      <div className="balance" id="help" onClick={handleHelpCard}>
        <h2>Nasıl Oynanır ?</h2>
      </div>
      <div
        className={`transparent-bg ${displayHelp}`}
        id="close-bg"
        onClick={(e) => handleCloseHelpCard(e)}
      >
        <div className="help-card">
          <span className="close-button">
            {" "}
            <AiOutlineCloseCircle id="close-bg" />
          </span>
          <div className="how-to-play">
            <h2>Nasıl Oynanır?</h2>
            <p>
              Elinizde 1-25 arasında numaralar verebileceğiniz 7 top bulunur.
            </p>
            <p>
              Bu toplardaki sayıları isterseniz random şekilde seçebilir yada
              kendi kaderinizi kendiniz belirleyip her birine istediğiniz sayıyı
              verebilirsiniz.
            </p>
            <p>
              Loto'yu başlattığınızda yine 1-25 sayıları arasında 4 tane top
              gelir.
            </p>
            <p>
              Eğer seçtiğiniz sayılar ile rastgele gelen 4 toptaki sayılar
              eşleşirse para kazanırsınız. Kazanç oranlarına aşağıdan
              bakabilirsiniz.
            </p>
            <div className="bet-table">
              <p>1 Top Eşleşmesi = Bahis tutarının %40'ı </p>
              <p>2 Top Eşleşmesi = Bahis tutarının %200'ı </p>
              <p>3 Top Eşleşmesi = Bahis tutarının %800'ı </p>
              <p>4 Top Eşleşmesi = Bahis tutarının %2500'ı </p>
            </div>
            <p>
              Bakiyeniz bittiğinde sağ üstteki + butonu ile 20.000$ bakiye
              yükleyebilirsiniz.
            </p>
            <p>Cross ile arka arkaya loto başlatabilirsiniz.</p>
          </div>
          <div className="rules">
            <h2>Kurallar!</h2>
            <p>Toplara gireceniz sayılar 1-25 arasında olmalıdır.</p>
            <p>Minimum bahis tutarı 10$ maksimum bahis tutarı 100.000$'dır.</p>
            <p>Her elde aynı sayıyı sadece 1 kez girebilirsiniz.</p>
            <p>Üstteki 3 kurala uyulmayan lotolar başlamaz!</p>

            <p>
              Loto başlatıldıktan sonra geri alınamaz. Butonlar pasif hale
              gelir.
            </p>
          </div>
        </div>
      </div>
      <div className="balance">
        <h2>
          Balance: $
          <CountUp start={prevBalance} end={balance} duration={0.5} />
        </h2>
        <AiOutlinePlusCircle
          size={36}
          style={{ color: "black", cursor: "pointer" }}
          onClick={() => {
            setPrevBalance(balance);
            setBalance((prev) => prev + 250);
          }}
        />
      </div>
      <div className="lotto-container">
        <div className="your-lotto">
          <div className="lotto-title">
            <h3>Your Lotto</h3>
            <p>Enter a number from 1-25</p>
          </div>
          <div className="lotto-balls">
            {yourLotto.map((ball, index) => (
              <input
                key={`yourLotto-${index}`}
                className={`lotto-ball ${
                  greenBallArray.includes(ball) ? "green-ball" : ""
                }`}
                min={1}
                max={25}
                value={ball}
                onChange={(e) => handleLotto(index, e.target.value)}
              />
            ))}
          </div>
          <div className="bet-container">
            <div className="input-container">
              <div>
                <label htmlFor="bet">Bet (10-100.000) $</label>
                <input
                  name="bet"
                  type="number"
                  min={10}
                  max={100000}
                  placeholder="total bet"
                  value={bet}
                  onChange={(e) => setBet(e.target.value)}
                  disabled={buttonDisable}
                />
              </div>
              <div>
                <label htmlFor="cross" id="cross-label">
                  Cross
                </label>
                <input
                  name="cross"
                  type="number"
                  min={1}
                  max={50}
                  placeholder="(x)"
                  id="cross-input"
                  value={cross}
                  onChange={handleCross}
                  disabled={buttonDisable}
                />
              </div>
            </div>
            <div className="button-container">
              <button
                name="bet"
                onClick={startLottery}
                disabled={buttonDisable}
                className={buttonDisable ? "disable-button" : "button"}
              >
                {buttonDisable ? "Good Luck" : "Start the Lottery"}
              </button>
              <button onClick={handleRandomNumber} disabled={buttonDisable}>
                {buttonDisable ? "pending..." : "Random"}
              </button>
            </div>
          </div>
        </div>

        <div className="main-lotto">
          <div className="lotto-title">
            <h3>Main Lotto</h3>
          </div>
          <div className="lotto-balls">
            <div className="block"></div>

            {randomLotto.map(
              (ball, index) =>
                ball !== "" && (
                  <div
                    className={`lotto-ball animate__animated animate__zoomInUp animate__faster ${
                      greenBallArray.includes(ball) ? "green-ball" : ""
                    }`}
                    key={`randomLotto-${index}`}
                  >
                    {ball}
                  </div>
                )
            )}
          </div>
        </div>

        <div className="indicator-container">
          <div className="remaining-lap-card">
            <h4>Remaining Lap:</h4>
            <p>{remLap}</p>
          </div>
          <div className="profit-card">
            <h4>Profit:</h4>
            <p
              className={`${animate} animate__faster`}
              style={{ fontSize: `${fontSize}px` }}
            >
              $
              <CountUp start={prevProfit} end={profit} duration={0.5} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lottery;
