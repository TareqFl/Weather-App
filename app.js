const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const https = require("https")
const mongoose = require("mongoose")
const http = require('http')



const apiKey = "c912e969e3e8fa1490a5726e6fc01aa5"
const url = "https://api.openweathermap.org/data/2.5/weather?q=Antalya&appid=c912e969e3e8fa1490a5726e6fc01aa5&units=metric&lang=en"



var forecast = {
  cityName: "",
  description: "",
  temp: "",
  feels_like: "",
  pressure: "",
  humidity: "",
  windspeed: "",
  time: new Date().toLocaleTimeString()
}







const app = express()

const port = 3000

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static("public"))






app.get("/", (req, res) => {
  res.render("home")
});

app.post("/", (req, res) => {


  const cityName = req.body.cityName
  const units = req.body.units
  const requestedURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=c912e969e3e8fa1490a5726e6fc01aa5&units=metric&lang=en"

  https.get(requestedURL, (result) => {
    result.on("data", (d) => {

      const information = JSON.parse(d)
      console.log(information)
      forecast.cityName = information.name;
      forecast.description = information.weather[0].description;
      forecast.temp = information.main.temp
      forecast.feels_like = information.main.feels_like
      forecast.pressure = information.main.pressure
      forecast.humidity = information.main.humidity
      forecast.windspeed = information.wind.speed

      res.redirect("/weather")
    });
  });
});

app.get("/weather", (req, res) => {
  res.render("weather", {
    forecast
  })
})

app.get("/getCurrentWeather", (req, res) => {

  const ipApiURL = "http://api.ipapi.com/api/check?access_key=a33156730359ff4a66566dcc7e63be55&language=en&fields=city"

  http.get(ipApiURL, (result) => {

    result.on("data", (data) => {
      const info = JSON.parse(data)
      console.log(info.city)

      const url_2 = "https://api.openweathermap.org/data/2.5/weather?q=" + info.city + "&appid=c912e969e3e8fa1490a5726e6fc01aa5&units=metric&lang=en"
      https.get(url_2, (results) => {
        results.on("data", (d) => {

          const information = JSON.parse(d)
          console.log(information)
          forecast.cityName = information.name;
          forecast.description = information.weather[0].description;
          forecast.temp = information.main.temp
          forecast.feels_like = information.main.feels_like
          forecast.pressure = information.main.pressure
          forecast.humidity = information.main.humidity
          forecast.windspeed = information.wind.speed

          res.redirect("/weather")
        });
      });




    })
  })
})

app.listen(port, () => console.log("server is up and running"))
