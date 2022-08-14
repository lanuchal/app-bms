import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Dimensions, ScrollView } from "react-native";
import moment from "moment";
import DateRangePicker from "react-native-daterange-picker";
import Speedometer from "react-native-speedometer-chart";
import axios from "axios";
import { LineChart } from "react-native-chart-kit";
import { api } from "../constants/Api";

const windowWidth = Dimensions.get("window").width;

const Links = ({ route }) => {
  const { itemId } = route.params;
  const [gagueValue, setGagueValue] = useState(50);
  // set min max brix
  const [brix, setBrix] = useState(0);
  const [rangColor, setRangeColor] = useState();
  const [brix_min, setBrix_min] = useState(0);
  const [brix_avg, setBrix_avg] = useState(0);
  const [brix_max, setBrix_max] = useState(0);
  const [data_result, setData_result] = useState();

  const [temp, setTemp] = useState(0);
  const [rangColor_temp, setRangeColor_temp] = useState();
  const [temp_min, setTemp_min] = useState(0);
  const [temp_avg, setTemp_avg] = useState(0);
  const [temp_max, setTemp_max] = useState(0);
  const [data_result_temp, setData_result_temp] = useState();

  const [brix_line, setBrix_line] = useState(0);
  const [brix_line_max, setBrix_line_min] = useState(0);
  const [brix_line_min, setBrix_line_max] = useState(0);
  const [brix_y, setBrix_y] = useState(0);

  const [temp_line, setTemp_line] = useState(0);
  const [temp_line_max, setTemp_line_min] = useState(0);
  const [temp_line_min, setTemp_line_max] = useState(0);
  const [temp_y, setTemp_y] = useState(0);

  const [dateRange, setDateRange] = useState({
    startDate: moment(),
    endDate: moment(),
  });
  const [displayedDate, setDisplayedDate] = useState(moment());

  const onChangeDate = (dates) => {
    setDateRange((dateRange) => ({
      ...dateRange,
      ...dates,
    }));
    dates.displayedDate ? setDisplayedDate(dates.displayedDate) : undefined;
  };

  useEffect(() => {
    get_brix(dateRange.startDate, dateRange.endDate);
    get_temp(dateRange.startDate, dateRange.endDate);
    get_brixline(dateRange.startDate, dateRange.endDate);
    get_templine(dateRange.startDate, dateRange.endDate);
    // get_brix_min(dateRange.startDate, dateRange.endDate);
  }, [dateRange]);

  // get brix ////////////////////////////////////////////////////////////////////////////
  const get_brix = async (start, end) => {
    const dateStart = JSON.stringify(start);
    const dateEnd = JSON.stringify(end);
    const resultdateStart = dateStart.slice(1, dateStart.length - 1);
    const resultdateEnd = dateEnd.slice(1, dateEnd.length - 1);
    await axios
      .get(api.brix + itemId + "/" + resultdateStart + "/" + resultdateEnd)
      .then(function (response) {
        setBrix(response.data.data[0].value);
      })
      .then(() => {
        setRangeColor(() => {
          if (brix <= 33) {
            return "#f3f72f";
          } else if (brix >= 34 && brix <= 66) {
            return "#00b928";
          } else {
            return "#c71d1d";
          }
        });
        setData_result(() => {
          if (brix <= 33) {
            return "LOW";
          } else if (brix >= 34 && brix <= 66) {
            return "OK";
          } else {
            return "HIGH";
          }
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    // min
    await axios
      .get(api.brixmin + itemId + "/" + resultdateStart + "/" + resultdateEnd)
      .then(function (response) {
        // console.log(response.data);
        setBrix_min(response.data.data[0].value);
      })
      .catch(function (error) {
        console.log(error);
      });
    // avg
    await axios
      .get(api.brixavg + itemId + "/" + resultdateStart + "/" + resultdateEnd)
      .then(function (response) {
        // console.log(response.data);
        setBrix_avg(response.data.data[0].value);
      })
      .catch(function (error) {
        console.log(error);
      });
    // max
    await axios
      .get(api.brixmax + itemId + "/" + resultdateStart + "/" + resultdateEnd)
      .then(function (response) {
        setBrix_max(response.data.data[0].value);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // get temp ////////////////////////////////////////////////////////////////////////////
  const get_temp = async (start, end) => {
    const dateStart = JSON.stringify(start);
    const dateEnd = JSON.stringify(end);
    const resultdateStart = dateStart.slice(1, dateStart.length - 1);
    const resultdateEnd = dateEnd.slice(1, dateEnd.length - 1);
    await axios
      .get(api.temp + itemId + "/" + resultdateStart + "/" + resultdateEnd)
      .then(function (response) {
        setTemp(response.data.data[0].value);
      })
      .then(() => {
        setRangeColor_temp(() => {
          if (brix <= 33) {
            return "#f3f72f";
          } else if (brix >= 34 && brix <= 66) {
            return "#00b928";
          } else {
            return "#c71d1d";
          }
        });
        setData_result_temp(() => {
          if (brix <= 33) {
            return "LOW";
          } else if (brix >= 34 && brix <= 66) {
            return "OK";
          } else {
            return "HIGH";
          }
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    // min
    await axios
      .get(api.tempmin + itemId + "/" + resultdateStart + "/" + resultdateEnd)
      .then(function (response) {
        // console.log(response.data);
        setTemp_min(response.data.data[0].value);
      })
      .catch(function (error) {
        console.log(error);
      });
    // avg
    await axios
      .get(api.tempavg + itemId + "/" + resultdateStart + "/" + resultdateEnd)
      .then(function (response) {
        // console.log(response.data);
        setTemp_avg(response.data.data[0].value);
      })
      .catch(function (error) {
        console.log(error);
      });
    // max
    await axios
      .get(api.tempmax + itemId + "/" + resultdateStart + "/" + resultdateEnd)
      .then(function (response) {
        // console.log(response.data);
        setTemp_max(response.data.data[0].value);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // get brixline ////////////////////////////////////////////////////////////////////////////
  const get_brixline = async (start, end) => {
    const dateStart = JSON.stringify(start);
    const dateEnd = JSON.stringify(end);
    const resultdateStart = dateStart.slice(1, dateStart.length - 1);
    const resultdateEnd = dateEnd.slice(1, dateEnd.length - 1);
    await axios
      .get(
        api.brixline +
          itemId +
          "/" +
          resultdateStart +
          "/" +
          resultdateEnd +
          "/5m"
      )
      .then(function (response) {
        const data_array = response.data.data;
        setBrix_line(
          data_array.map((index) => {
            return index.value;
          })
        );
        setBrix_y(
          data_array.map((index) => {
            return convertDate(index.time);
          })
        );
        // console.log(brix_y);
      })
      .catch(function (error) {
        console.log(error);
      });
    await axios
      .get(
        api.brixlinemin + itemId + "/" + resultdateStart + "/" + resultdateEnd
      )
      .then(function (response) {
        const data = response.data.data[0].min;
        const data_array = response.data.data;
        data
          ? setBrix_line_min(
              data_array.map((index) => {
                return index.min;
              })
            )
          : undefined;
      })
      .catch(function (error) {
        console.log(error);
      });
    await axios
      .get(
        api.brixlinemax + itemId + "/" + resultdateStart + "/" + resultdateEnd
      )
      .then(function (response) {
        const data = response.data.data[0].max;
        const data_array = response.data.data;
        data
          ? setBrix_line_max(
              data_array.map((index) => {
                return index.max;
              })
            )
          : undefined;
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // get templine ////////////////////////////////////////////////////////////////////////////
  const get_templine = async (start, end) => {
    const dateStart = JSON.stringify(start);
    const dateEnd = JSON.stringify(end);
    const resultdateStart = dateStart.slice(1, dateStart.length - 1);
    const resultdateEnd = dateEnd.slice(1, dateEnd.length - 1);

    await axios
      .get(
        api.templinemin + itemId + "/" + resultdateStart + "/" + resultdateEnd
      )
      .then(function (response) {
        const data = response.data.data[0].min;
        const data_array = response.data.data;
        console.log("tempmin", data_array);
        data
          ? setTemp_line_min(
              data_array.map((index) => {
                return index.min;
              })
            )
          : undefined;
      })
      .catch(function (error) {
        console.log(error);
      });
    await axios
      .get(
        api.templinemax + itemId + "/" + resultdateStart + "/" + resultdateEnd
      )
      .then(function (response) {
        const data = response.data.data[0].max;
        const data_array = response.data.data;
        console.log("tempmax", data_array);
        data
          ? setTemp_line_max(
              data_array.map((index) => {
                return index.max;
              })
            )
          : undefined;
      })
      .catch(function (error) {
        console.log(error);
      });
    await axios
      .get(
        api.templine +
          itemId +
          "/" +
          resultdateStart +
          "/" +
          resultdateEnd +
          "/5m"
      )
      .then(function (response) {
        const data = response.data.data[0].value;
        const data_array = response.data.data;
        console.log("templine", data_array);
        data
          ? setTemp_line(
              data_array.map((index) => {
                return index.value;
              })
            )
          : undefined;
        data
          ? setTemp_y(
              data_array.map((index) => {
                return convertDate(index.time);
              })
            )
          : undefined;
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  function convertDate(inputFormat) {
    function pad(s) {
      return s < 10 ? "0" + s : s;
    }
    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("/");
  }

  return (
    <View style={{ backgroundColor: "#fff", paddingTop: 5 }}>
      <DateRangePicker
        onChange={(e) => onChangeDate(e)}
        endDate={dateRange.endDate}
        startDate={dateRange.startDate}
        displayedDate={displayedDate}
        range
      >
        <View style={styles.btn_time}>
          <Text style={{ fontSize: 30, color: "#fff" }}>select date</Text>
        </View>
      </DateRangePicker>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* chart value 1*/}
          <View style={styles.box_chart}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                marginBottom: 5,
              }}
            >
              Brix Chart
            </Text>
            <LineChart
              data={{
                labels: [brix_y],
                datasets: [
                  {
                    data: [brix_line_max],
                    color: (opacity = 1) => `rgba(68, 255, 199, ${opacity})`,
                    propsForDots: {
                      r: "4",
                      stroke: "#44ffc7",
                    },
                  },
                  {
                    data: [brix_line],
                    color: (opacity = 1) => `rgba(232, 235, 61,${opacity})`,
                    propsForDots: {
                      r: "4",
                      stroke: "#e8eb3d",
                    },
                  },
                  {
                    data: [brix_line_min],
                    color: (opacity = 1) => `rgba(235, 81, 61,${opacity})`,
                    propsForDots: {
                      r: "4",
                      stroke: "#eb513d",
                    },
                  },
                ],
                legend: ["brixmin", "brixline", "brixmax"],
              }}
              width={Dimensions.get("window").width - 20} // from react-native
              height={220}
              yAxisInterval={2} // optional, defaults to 1
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#1b4900",
                backgroundGradientTo: "#2e9933",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              // bezier
              style={{
                marginVertical: 0,
                borderRadius: 16,
              }}
            />
          </View>

          {/* chart value 2*/}
          <View style={styles.box_chart}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                marginBottom: 5,
              }}
            >
              Temp Chart
            </Text>
            <LineChart
              data={{
                labels: [temp_y],
                datasets: [
                  {
                    data: [temp_line_max],
                    color: (opacity = 1) => `rgba(68, 255, 199, ${opacity})`,
                    propsForDots: {
                      r: "4",
                      stroke: "#44ffc7",
                    },
                  },
                  {
                    data: [temp_line],
                    color: (opacity = 1) => `rgba(232, 235, 61,${opacity})`,
                    propsForDots: {
                      r: "4",
                      stroke: "#e8eb3d",
                    },
                  },
                  {
                    data: [temp_line_min],
                    color: (opacity = 1) => `rgba(235, 81, 61,${opacity})`,
                    propsForDots: {
                      r: "4",
                      stroke: "#eb513d",
                    },
                  },
                ],
                legend: ["tempmin", "templine", "tempmax"],
              }}
              width={Dimensions.get("window").width - 20} // from react-native
              height={220}
              // yAxisLabel="$"
              yAxisInterval={2} // optional, defaults to 1
              chartConfig={{
                paddingTop: 20,
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#000b49",
                backgroundGradientTo: "#5762c5",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                margin: 0,
                // propsForDots: {
                //   r: "4",
                //   stroke: "#5762c5",
                // },
              }}
              // bezier
              style={{
                marginVertical: 0,
                borderRadius: 16,
              }}
            />
          </View>

          {/* gauge value */}
          <View style={styles.box}>
            <Text
              style={{
                textAlign: "left",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                display: "flex",
                flexDirection: "row",
                fontSize: 20,
                width: windowWidth - 70,
                fontWeight: "600",
              }}
            >
              Brix (%)
            </Text>
            <Speedometer
              value={brix}
              totalValue={100}
              size={windowWidth - 70}
              showIndicator
              outerColor="#e6e6e6"
              internalColor={rangColor}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                marginTop: 5,
              }}
            >
              Brix : {brix} % ( {data_result} )
            </Text>
          </View>

          {/* 3 value part1 */}
          <View style={styles.box2}>
            <View style={styles.box_avg}>
              <View style={styles.txt_min}>
                <Text>MIN.</Text>
              </View>
              <Text style={styles.text_}>{brix_min} %</Text>
            </View>
            <View style={styles.box_avg}>
              <View style={styles.txt_avg}>
                <Text>AVG.</Text>
              </View>

              <Text style={styles.text_}>{brix_avg} %</Text>
            </View>
            <View style={styles.box_avg}>
              <View style={styles.txt_max}>
                <Text>MAX.</Text>
              </View>
              <Text style={styles.text_}>{brix_max} %</Text>
            </View>
          </View>

          {/* temp value */}
          <View style={styles.box}>
            <Text
              style={{
                textAlign: "left",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                display: "flex",
                flexDirection: "row",
                fontSize: 20,
                width: windowWidth - 70,
                fontWeight: "600",
              }}
            >
              Temp (°C)
            </Text>
            <Speedometer
              value={temp}
              totalValue={100}
              size={windowWidth - 70}
              showIndicator
              outerColor="#e6e6e6"
              internalColor={rangColor_temp}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                marginTop: 5,
              }}
            >
              Temp : {temp} °C ( {data_result_temp} )
            </Text>
          </View>
          {/* 3 value part2 */}
          <View style={styles.box2}>
            <View style={styles.box_avg}>
              <View style={styles.txt_min}>
                <Text>MIN.</Text>
              </View>
              <Text style={styles.text_}>{temp_min} %</Text>
            </View>
            <View style={styles.box_avg}>
              <View style={styles.txt_avg}>
                <Text>AVG.</Text>
              </View>

              <Text style={styles.text_}>{temp_avg} %</Text>
            </View>
            <View style={styles.box_avg}>
              <View style={styles.txt_max}>
                <Text>MAX.</Text>
              </View>
              <Text style={styles.text_}>{temp_max} %</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6e6e6",
    // position: "relative",
    padding: 10,
    alignItems: "center",
    // position:"relative",
  },
  scrollView: {
    paddingTop: 10,
    paddingBottom: 20,
    marginBottom: 50,
  },
  btn_time: {
    backgroundColor: "#448fff",
    height: 40,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    borderRadius: 16,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
  },
  box_chart: {
    marginBottom: 10,
    display: "flex",
    flexDirection: "col",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#fff",
    paddingTop: 10,
  },
  box: {
    width: "100%",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  box2: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#e6e6e6",
    border: 5,
    marginBottom: 10,
    borderWidth: 1,
  },
  box_avg: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  txt_min: {
    height: 50,
    width: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f72f",
    borderRadius: 50,
    marginRight: 10,
  },
  txt_avg: {
    height: 50,
    width: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00b928",
    borderRadius: 50,
    marginRight: 10,
  },
  txt_max: {
    height: 50,
    width: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#c71d1d",
    borderRadius: 50,
    marginRight: 10,
  },
  text_: {
    fontSize: 24,
  },
});
export default Links;
