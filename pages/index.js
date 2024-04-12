import Subscribe from "@/components/Subscribe";
import { bus, h2 } from "fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";

const myAPI_KEY = process.env.myAPI_KEY2;

// Define a cache object to store the fetched data
let cache = {
  topNews: null,
  politicsNews: null,
  techNews: null,
  businessNews: null,
};

export async function getStaticProps() {
  try {
    // Check if the data is already cached
    if (
      cache.topNews &&
      cache.politicsNews &&
      cache.techNews &&
      cache.businessNews
    ) {
      return {
        props: cache,
        revalidate: 10,
      };
    }

    // fetch 3 articles from the 'top' category
    const topRes = await fetch(
      `https://newsdata.io/api/1/news?apikey=${myAPI_KEY}&country=us&language=en&category=top&size=3`
    );
    const topData = await topRes.json();
    const topNewsAll = topData.results;

    // size=3 does not seem to work properly when having multiple categories
    const categoryRes = await fetch(
      `https://newsdata.io/api/1/news?apikey=${myAPI_KEY}&country=us&language=en&category=politics,technology,business`
    );
    const categoryData = await categoryRes.json();
    const categoryNews = categoryData.results;

    // Filter and cache the data, and also only save up to 3 articles from each category.
    cache = {
      topNews: topNewsAll,
      politicsNews: categoryNews.filter(
        (article, index) => article.category.includes("politics") && index < 3
      ),
      techNews: categoryNews.filter(
        (article, index) => article.category.includes("technology") && index < 3
      ),
      businessNews: categoryNews.filter(
        (article, index) => article.category.includes("business") && index < 3
      ),
    };

    return {
      props: cache,
      revalidate: 10,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      props: {
        error: true,
      },
      revalidate: 10,
    };
  }
}

export default function News({
  topNews, // destructured from 'cache' object
  politicsNews,
  techNews,
  businessNews,
  // allNews,
  error,
}) {
  /* const [politicsNews, setPoliticsNews] = useState([]);
  const [topNews, setTopNews] = useState([]);
  const [techNews, setTechNews] = useState([]);
  const [businessNews, setBusinessNews] = useState([]);
 
  useEffect(() => {
    if (allNews) {
      const politics = allNews.filter((article) =>
        article.category.includes("politics")
      );
      setPoliticsNews(politics);
console.log("politicsNews:", politicsNews.length);

  
      const top = allNews.filter((article) =>
        article.category.includes("top")
      );
      setTopNews(top);
  console.log("Topnews length: ", topNews.length);

  
      const tech = allNews.filter((article) =>
        article.category.includes("technology")
      );
      setTechNews(tech);
console.log("techNews:", techNews.length);

  
      const business = allNews.filter((article) =>
        article.category.includes("business")
      );
      setBusinessNews(business);
      console.log("businessNews:", businessNews.length);

    }
  }, [allNews]);
  
  
  if (allNews) {
    console.log("allNews: ", allNews.length);
  } */

  if (politicsNews) {
    console.log("politicsa: ", politicsNews.length);
  }
  if (techNews) {
    console.log("tech: ", techNews.length);
  }

  if (businessNews) {
    console.log("business: ", businessNews.length);
  }

  if (topNews) {
    console.log("top: ", topNews.length);
  }

  const [hovered, setIsHovered] = useState(false);

  function handleMouseEnter(articleId) {
    setIsHovered((prevHoveredItems) => ({
      ...prevHoveredItems,
      [articleId]: true,
    }));
  }

  function handleMouseLeave(articleId) {
    setIsHovered((prevHoveredItems) => ({
      ...prevHoveredItems,
      [articleId]: false,
    }));
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-44">
        <h2 className="text-5xl text-center ">
          Oh no! Seems like we hit the rate limit. <br /> Check back in a bit
          for the headlines!
        </h2>
      </div>
    );
  }

  return (
    <>
      <div className="grid mt-10 grid-cols-4 gap-8 mx-20">
        <div className="flex col-span-3 flex-col w-full px-0 ">
          <ul className="list-none p-0">
            <div className="block mb-4 border-t-2 border-b-0 border-l-0 border-r-0 border-solid border-black dark:border-[#EEEFF2]">
              <div className="flex">
                <h3 className="bg-black dark:bg-white text-white dark:text-black p-2 m-0 text-sm">
                  Our top pick
                </h3>
              </div>
            </div>

            {/* render techNews if it is defined and has more than 0 articles, otherwise render topNews which typically seems to find articles */}
            {(techNews && techNews.length > 0 ? techNews : topNews) &&
              (techNews && techNews.length > 0 ? techNews : topNews)
                .filter((article, index) => index === 0)
                .map((article, index) => (
                  <li
                    onMouseOver={() => handleMouseEnter(article.article_id)}
                    onMouseLeave={() => handleMouseLeave(article.article_id)}
                    key={article.article_id}
                    className="flex mb-4 col-span-2 hover:cursor-pointer"
                  >
                    <div>
                      <img
                        className="h-96 w-full object-cover"
                        src={
                          article.image_url
                            ? article.image_url
                            : "Abstract HD.jpg"
                        }
                        alt=""
                      />

                      <Link
                        className="no-underline"
                        href={`/article/${article.category[0]}/${article.article_id}`}
                        passHref
                      >
                        <h2
                          className={`$  text-black font-semibold dark:text-white text-5xl ${
                            hovered[article.article_id]
                              ? "underline decoration-2"
                              : "no-underline"
                          }`}
                        >
                          {article.title}
                        </h2>
                      </Link>
                      <p className="decoration-none">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Ad ipsum illum quia magni incidunt pariatur atque, error
                        accusantium minima eveniet?
                      </p>
                    </div>
                  </li>
                ))}
          </ul>
        </div>

        {/* Right Side */}
        <div className="col-span-1 flex  w-full ">
          <ul className="list-none p-0">
            <div className="block mb-4 border-t-2 border-b-0 border-l-0 border-r-0 border-solid border-black dark:border-[#EEEFF2]">
              <div className="flex">
                <h3 className="bg-black dark:bg-white text-white dark:text-black p-2 m-0 text-sm">
                  Latest
                </h3>
              </div>
            </div>
             {/* show first article from each category */}
            {[...politicsNews, ...techNews, ...businessNews, ...topNews].map(
              (article, index) => {
                if (index < 4) {
                  return (
                    <li
                      onMouseOver={() => handleMouseEnter(article.article_id)}
                      onMouseLeave={() => handleMouseLeave(article.article_id)}
                      key={article.article_id}
                      className={`flex flex-col w-5/5 px-0 ${
                        index < 3 ? "custom-thin-border-bottom" : ""
                      }`}
                    >
                      <Link
                        className="no-underline"
                        href={`/article/${article.category[0]}/${article.article_id}`}
                        passHref
                      >
                        <h2
                          className={`text-black dark:text-white text-lg w-full object-cover ${
                            hovered[article.article_id]
                              ? "underline decoration-2"
                              : "no-underline"
                          }`}
                        >
                          {article.title}
                        </h2>
                      </Link>
                    </li>
                  );
                }
                return null;
              }
            )}
          </ul>
        </div>
        {/* Business */}
        <div className="col-span-4 px-0 flex flex-col justify-evenly">
          <div className="block mb-4 border-t-2 border-b-0 border-l-0 border-r-0 border-solid border-black dark:border-[#EEEFF2]">
            <div className="flex">
              <h3 className="bg-black dark:bg-white text-white dark:text-black p-2 m-0 text-sm">
                Business
              </h3>
            </div>
          </div>

          {/* Removed px-20 */}
          <ul className="flex flex-row justify-evenly w-full p-0 flex-1">
          {businessNews && businessNews.length > 0 ? (
              businessNews.map((article, index) => (
                <li
                  onMouseOver={() => handleMouseEnter(article.article_id)}
                  onMouseLeave={() => handleMouseLeave(article.article_id)}
                  key={article.article_id}
                  className={`flex w-1/4 flex-col mb-4  hover:cursor-pointer${
                    index === 1 ? "mx-8" : ""
                  } ${index === 2 ? "mr-8" : ""} ${
                    index < 3 ? "custom-thin-border-right px-8" : ""
                  }`}
                >
                  <div className="flex flex-col space-y-2 mb-4">
                    {article.image_url && (
                      <img
                        className="h-28 w-full object-cover"
                        src={
                          article.image_url !== null
                            ? article.image_url
                            : "/Abstract HD.jpg"
                        }
                        onLoad={() =>
                          console.log(
                            "Image loaded:",
                            article.image_url || "/Abstract HD.jpg"
                          )
                        }
                        alt=""
                      />
                    )}
                    <Link
                      className="no-underline"
                      href={`/article/${article.category[0]}/${article.article_id}`}
                    >
                      <h2
                        className={`text-black dark:text-white text-2xl ${
                          hovered[article.article_id]
                            ? "underline decoration-2"
                            : "no-underline"
                        }`}
                      >
                        {article.title}
                      </h2>
                    </Link>
                  </div>
                </li>
              ))) : (<h2>Sorry, no Politics News could be fetched</h2>)}
          </ul>
        </div>
        {/* Lifestyle */}
        <div className="col-span-4 px-0 ">
          <div className="block mb-4 border-t-2 border-b-0 border-l-0 border-r-0 border-solid border-black dark:border-[#EEEFF2]">
            <div className="flex">
              <h3 className="bg-black dark:bg-white text-white dark:text-black p-2 m-0 text-sm">
                Politics
              </h3>
            </div>
          </div>
          {/* Removed px-20 */}
          <ul className="flex justify-center w-full p-0 ">
            {politicsNews && politicsNews.length > 0 ? (
              politicsNews.map((article, index) => (
                <li
                  onMouseOver={() => handleMouseEnter(article.article_id)}
                  onMouseLeave={() => handleMouseLeave(article.article_id)}
                  key={article.article_id}
                  className={`flex w-1/4 flex-col mb-4  hover:cursor-pointer${
                    index === 1 ? "mx-8" : ""
                  } ${index === 2 ? "mr-8" : ""} ${
                    index < 3 ? "custom-thin-border-right px-8" : ""
                  }`}
                >
                  <div className="flex flex-col space-y-2 mb-4">
                    {article.image_url && (
                      <img
                        className="h-28 w-full object-cover"
                        src={
                          article.image_url !== null
                            ? article.image_url
                            : "/Abstract HD.jpg"
                        }
                        onLoad={() =>
                          console.log(
                            "Image loaded:",
                            article.image_url || "/Abstract HD.jpg"
                          )
                        }
                        alt=""
                      />
                    )}
                    <Link
                      className="no-underline"
                      href={`/article/${article.category[0]}/${article.article_id}`}
                    >
                      <h2
                        className={`text-black dark:text-white text-2xl ${
                          hovered[article.article_id]
                            ? "underline decoration-2"
                            : "no-underline"
                        }`}
                      >
                        {article.title}
                      </h2>
                    </Link>
                  </div>
                </li>
              ))) : (<h2>Sorry, no Politics News could be fetched</h2>)}
          </ul>
        </div>
        <div className="col-span-4 px-0 flex flex-col">
          <div className="block mb-4 border-t-2 border-b-0 border-l-0 border-r-0 border-solid border-black dark:border-[#EEEFF2]">
            <div className="flex">
              <h3 className="bg-black dark:bg-white text-white dark:text-black p-2 m-0 text-sm">
                Top news in your area
              </h3>
            </div>
          </div>

          {/* Removed px-20 */}
          <ul className="flex flex-row justify-between w-full p-0">
            {topNews &&
              topNews.map((article, index) => (
                <li
                  onMouseOver={() => handleMouseEnter(article.article_id)}
                  onMouseLeave={() => handleMouseLeave(article.article_id)}
                  key={article.article_id}
                  className={`flex w-1/4 flex-col mb-4  hover:cursor-pointer${
                    index === 1 ? "mx-8" : ""
                  } ${index === 2 ? "mr-8" : ""} ${
                    index < 3 ? "custom-thin-border-right px-8" : ""
                  }`}
                >
                  <div className="flex flex-col space-y-2 mb-4">
                    {article.image_url && (
                      <img
                        className="h-28 w-full object-cover"
                        src={
                          article.image_url !== null
                            ? article.image_url
                            : "/Abstract HD.jpg"
                        }
                        onLoad={() =>
                          console.log(
                            "Image loaded:",
                            article.image_url || "/Abstract HD.jpg"
                          )
                        }
                        alt=""
                      />
                    )}
                    <Link
                      className="no-underline"
                      href={`/article/${article.category[0]}/${article.article_id}`}
                    >
                      <h2
                        className={`text-black dark:text-white text-2xl ${
                          hovered[article.article_id]
                            ? "underline decoration-2"
                            : "no-underline"
                        }`}
                      >
                        {article.title}
                      </h2>
                    </Link>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>

      <Subscribe />
    </>
  );

  // function capitalizeFirstLetter(string) {
  //   if (typeof string !== "string" || string.length === 0) {
  //     return ""; // Return an empty string if the input is not a string or is empty
  //   }
  //   return string.charAt(0).toUpperCase() + string.slice(1);

  // }
}
