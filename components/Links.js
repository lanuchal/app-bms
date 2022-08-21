import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Dimensions, ScrollView } from "react-native";
import moment from "moment";
import DateRangePicker from "react-native-daterange-picker";
import Speedometer from "react-native-speedometer-chart";
import axios from "axios";
import { LineChart } from "react-native-chart-kit";
//import { api } from "../constants/Api";
import { api_main } from "../constants/Api_main";
import { api_path } from "../constants/Api_path";

// import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import RNPickerSelect from "react-native-picker-select";
import Brix from "./brixline/Brix";

import Loadpage from "./Loadpage";
const windowWidth = Dimensions.get("window").width;

const Links = ({ route, navigation }) => {
  const [isLoading_log, setIsLoading_log] = useState(navigation ? true : false);

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

  const [time_select, setTime_select] = useState("5m");

  const time_data = [
    { label: "time", value: "5m" },
    { label: "5m", value: "5m" },
    { label: "10m", value: "10m" },
    { label: "30m", value: "30m" },
    { label: "1h", value: "1h" },
    { label: "6h", value: "6h" },
    { label: "1d", value: "1d" },
    { label: "7d", value: "7d" },
  ];

  const [dateRange, setDateRange] = useState({
    startDate: moment(),
    endDate: moment(),
  });
  const [displayedDate, setDisplayedDate] = useState(moment());

  const [start_date, setStart_date] = useState(moment());
  const [end_date, setEnd_date] = useState(moment());

  const onChangeDate = (dates) => {
    setDateRange((dateRange) => ({
      ...dateRange,
      ...dates,
    }));

    dates.displayedDate ? setDisplayedDate(dates.displayedDate) : undefined;
    setEnd_date(dates.endDate);
    setStart_date(dates.startDate);

    if (dates.endDate) {
      get_brix(dateRange.startDate, dates.endDate);
      get_temp(dateRange.startDate, dates.endDate);
      get_brixline(dateRange.startDate, dates.endDate);
      get_templine(dateRange.startDate, dates.endDate);
    }
  };

  console.log();
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsLoading_log(true);
      setDateRange({
        startDate: moment(),
        endDate: moment(),
      });
      get_brix(dateRange.startDate, dateRange.endDate);
      setTimeout(() => {
        setIsLoading_log(false);
      }, 200);
    });
    return unsubscribe;
  }, [navigation]);

  // get brix ////////////////////////////////////////////////////////////////////////////
  const get_brix = async (start, end) => {
    const dateStart = JSON.stringify(start);
    const dateEnd = JSON.stringify(end);
    const resultdateStart = dateStart.slice(1, dateStart.length - 1);
    const resultdateEnd = dateEnd.slice(1, dateEnd.length - 1);
    const URL1 =
      api_main.main_brix +
      api_path.brix +
      itemId +
      "/" +
      resultdateStart +
      "/" +
      resultdateEnd;

    const URL2 =
      api_main.main_brix +
      api_path.brixmin +
      itemId +
      "/" +
      resultdateStart +
      "/" +
      resultdateEnd;

    const URL3 =
      api_main.main_brix +
      api_path.brixavg +
      itemId +
      "/" +
      resultdateStart +
      "/" +
      resultdateEnd;

    const URL4 =
      api_main.main_brix +
      api_path.brixmax +
      itemId +
      "/" +
      resultdateStart +
      "/" +
      resultdateEnd;

    const promise1 = await axios.get(URL1);
    const promise2 = await axios.get(URL2);
    const promise3 = await axios.get(URL3);
    const promise4 = await axios.get(URL4);

    axios
      .all([promise1, promise2, promise3, promise4])
      .then(
        axios.spread((...x) => {
          if (x[0].data.data[0]) {
            // console.log(x[0].data.data[0].value);
            setBrix(x[0].data.data[0].value);
            setTimeout(() => {
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
            }, 100);
          }

          // brix min
          if (x[1].data.data[0]) {
            setBrix_min(x[1].data.data[0].value);
          }
          if (x[2].data.data[0]) {
            setBrix_avg(x[2].data.data[0].value);
          }
          if (x[3].data.data[0]) {
            setBrix_max(x[3].data.data[0].value);
          }
        })
      )
      .catch((errors) => {
        console.error(errors);
      });
  };

  // get temp ////////////////////////////////////////////////////////////////////////////
  const get_temp = async (start, end) => {
    const dateStart = JSON.stringify(start);
    const dateEnd = JSON.stringify(end);
    const resultdateStart = dateStart.slice(1, dateStart.length - 1);
    const resultdateEnd = dateEnd.slice(1, dateEnd.length - 1);

    let URL1 =
      api_main.main_brix +
      api_path.temp +
      itemId +
      "/" +
      resultdateStart +
      "/" +
      resultdateEnd;

    let URL2 =
      api_main.main_brix +
      api_path.tempmin +
      itemId +
      "/" +
      resultdateStart +
      "/" +
      resultdateEnd;

    let URL3 =
      api_main.main_brix +
      api_path.tempavg +
      itemId +
      "/" +
      resultdateStart +
      "/" +
      resultdateEnd;

    let URL4 =
      api_main.main_brix +
      api_path.tempmax +
      itemId +
      "/" +
      resultdateStart +
      "/" +
      resultdateEnd;

    const promise1 = await axios.get(URL1);
    const promise2 = await axios.get(URL2);
    const promise3 = await axios.get(URL3);
    const promise4 = await axios.get(URL4);

    axios
      .all([promise1, promise2, promise3, promise4])
      .then(
        axios.spread((...x) => {
          // console.log(x[0].data);

          if (x[0].data.data[0]) {
            // console.log(x[0].data.data[0].value);
            setTemp(x[0].data.data[0].value);
            setTimeout(() => {
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
            }, 120);
          }
          if (x[1].data.data[0]) {
            // console.log(x[1].data.data[0].value);
            setTemp_min(x[1].data.data[0].value);
          }
          if (x[2].data.data[0]) {
            // console.log(x[2].data.data[0].value);
            setTemp_avg(x[2].data.data[0].value);
          }
          if (x[3].data.data[0]) {
            // console.log(x[3].data.data[0].value);
            setTemp_max(x[3].data.data[0].value);
          }
        })
      )
      .catch((errors) => {
        console.error(errors);
      });
  };

  // get brixline ////////////////////////////////////////////////////////////////////////////
  const get_brixline = async (start, end) => {
    const dateStart = JSON.stringify(start);
    const dateEnd = JSON.stringify(end);
    const resultdateStart = dateStart.slice(1, dateStart.length - 1);
    const resultdateEnd = dateEnd.slice(1, dateEnd.length - 1);

    let URL1 =
      api_main.main_brix +
      api_path.brixline +
      itemId +
      "/" +
      resultdateStart +
      "/" +
      resultdateEnd +
      "/" +
      time_select;

    let URL2 =
      api_main.main_brix +
      api_path.brixlinemin +
      itemId +
      "/" +
      resultdateStart +
      "/" +
      resultdateEnd;

    let URL3 =
      api_main.main_brix +
      api_path.brixlinemax +
      itemId +
      "/" +
      resultdateStart +
      "/" +
      resultdateEnd;

    const promise1 = await axios.get(URL1);
    const promise2 = await axios.get(URL2);
    const promise3 = await axios.get(URL3);

    axios
      .all([promise1, promise2, promise3])
      .then(
        axios.spread((...x) => {
          // console.log("get_brixlinex", x[0].data);

          if (x[0].data) {
            const data_array = x[0].data.data;
            // console.log("data0", data_array);
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
          }
          if (x[1].data.data[0]) {
            const data_array = x[1].data.data;
            // console.log("data1", data_array);
            setBrix_line_min(
              data_array.map((index) => {
                return index.min;
              })
            );
          }
          if (x[2].data.data[0]) {
            const data_array = x[2].data.data;
            // console.log("data2", data_array);
            setBrix_line_max(
              data_array.map((index) => {
                return index.max;
              })
            );
          }
        })
      )
      .catch((errors) => {
        console.error(errors);
      });
  };

  // get templine ////////////////////////////////////////////////////////////////////////////
  const get_templine = async (start, end) => {
    const dateStart = JSON.stringify(start);
    const dateEnd = JSON.stringify(end);
    const resultdateStart = dateStart.slice(1, dateStart.length - 1);
    const resultdateEnd = dateEnd.slice(1, dateEnd.length - 1);

    let URL1 =
      api_main.main_brix +
      api_path.templinemin +
      itemId +
      "/" +
      resultdateStart +
      "/" +
      resultdateEnd;

    let URL2 =
      api_main.main_brix +
      api_path.templinemax +
      itemId +
      "/" +
      resultdateStart +
      "/" +
      resultdateEnd;

    let URL3 =
      api_main.main_brix +
      api_path.templine +
      itemId +
      "/" +
      resultdateStart +
      "/" +
      resultdateEnd +
      "/" +
      time_select;

    const promise1 = await axios.get(URL1);
    const promise2 = await axios.get(URL2);
    const promise3 = await axios.get(URL3);

    axios
      .all([promise1, promise2, promise3])
      .then(
        axios.spread((...x) => {
          // console.log("get_brixlinex", x[0].data);

          if (x[0].data) {
            const data_array = x[0].data.data;
            console.log("data0", data_array);
            setTemp_line_min(
              data_array.map((index) => {
                return index.min;
              })
            );
            // setBrix_line(
            //   data_array.map((index) => {
            //     return index.value;
            //   })
            // );
            // setBrix_y(
            //   data_array.map((index) => {
            //     return convertDate(index.time);
            //   })
            // );
            //     const data = response.data.data[0].min;
            // const data_array = response.data.data;
            // console.log("tempmin", data_array);
            // data
            //   ?
            //   : undefined;
          }
          if (x[1].data.data[0]) {
            const data_array = x[1].data.data;
            console.log("data1", data_array);
            setTemp_line_max(
              data_array.map((index) => {
                return index.max;
              })
            );
            //     const data = response.data.data[0].max;
            // const data_array = response.data.data;
            // console.log("tempmax", data_array);
            // data
            //   ? setTemp_line_max(
            //       data_array.map((index) => {
            //         return index.max;
            //       })
            //     )
            //   : undefined;
          }
          if (x[2].data.data[0]) {
            const data_array = x[2].data.data;
            console.log("data2", data_array);
            setTemp_line(
              data_array.map((index) => {
                return index.value;
              })
            );
            setTemp_y(
              data_array.map((index) => {
                return convertDate(index.time);
              })
            );
            // setBrix_line_max(
            //   data_array.map((index) => {
            //     return index.max;
            //   })
            // );
            //   const data = response.data.data[0].value
            //   ? response.data.data[0].value
            //   : null;
            // const data_array = response.data.data ? response.data.data : null;

            // console.log("templine", data_array);
            // data
            //   ? setTemp_line(
            //       data_array.map((index) => {
            //         return index.value;
            //       })
            //     )
            //   : undefined;
            // data
            //   ? setTemp_y(
            //       data_array.map((index) => {
            //         return convertDate(index.time);
            //       })
            //     )
            //   : undefined;
          }
        })
      )
      .catch((errors) => {
        console.error(errors);
      });
  };

  function convertDate(inputFormat) {
    function pad(s) {
      return s < 10 ? "0" + s : s;
    }
    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("/");
  }
  // console.log("isLoading_log", isLoading_log);
  if (isLoading_log) {
    return <Loadpage />;
  }
  return (
    <View style={{ backgroundColor: "#215199", paddingTop: 10 }}>
      <DateRangePicker
        onChange={(e) => onChangeDate(e)}
        endDate={dateRange.endDate}
        startDate={dateRange.startDate}
        displayedDate={displayedDate}
        range
      >
        <View style={styles.btn_time}>
          <Text style={{ fontSize: 16, color: "#000" }}>date</Text>
        </View>
      </DateRangePicker>
      <View
        style={{
          width: "80%",
          padding: 0,
          paddingLeft: 20,
          display: "flex",
          flexDirection: "row",
          // justifyContent:'space-between',
          alignItems: "center",
          paddingBottom: 10,
          backgroundColor: "#215199",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: "#fff",
            marginLeft: 10,
            flexGrow: 1,
          }}
        >
          select date and time ...
        </Text>

        <View
          style={{
            backgroundColor: "#448fff",
            width: "30%",
            borderRadius: 6,
            height:50
          }}
        >
          <RNPickerSelect
            value={time_select}
            onValueChange={(value) => setTime_select(value)}
            items={time_data}
            color="#fff"
          />
        </View>
      </View>
      {/* </View> */}

      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* chart value 1*/}
          <View style={styles.box_chart1}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                marginBottom: 5,
                color: "#fff",
                // backgroundColor:"#006b4b93",
              }}
            >
              Brix Char t
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
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              // bezier
              style={{
                marginVertical: 0,
                borderRadius: 16,
              }}
            />
          </View>
          {/* <Brix
            start={dateRange.startDate}
            end={dateRange.endDate}
            itemI={itemId}
            time_select={time_select}
          /> */}
          {/* chart value 2*/}
          <View style={styles.box_chart2}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                marginBottom: 5,
                color: "#fff",
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
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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
          <View style={styles.box_chart3}>
            {/* gauge value */}
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                marginBottom: 5,
                color: "#fff",
                // color:"#2596ff"
              }}
            >
              Brix (%)
            </Text>
            <View style={styles.box}>
              <Speedometer
                value={brix}
                totalValue={100}
                size={windowWidth - 70}
                showIndicator={true}
                // outerColor="#fff"
                internalColor={rangColor}
                // innerColor="#292d4e00"
                indicatorColor="#fff"
              />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "600",
                  marginTop: 5,
                  // color:"#2596ff"
                }}
              >
                Brix : {brix} % ( {data_result} )
              </Text>

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
            </View>
          </View>
          {/* 3 value part1 */}
          <View style={styles.box_chart4}>
            {/* gauge value */}
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                marginBottom: 5,
                color: "#fff",
                // color:"#2596ff"
              }}
            >
              Temp (°C)
            </Text>
            <View style={styles.box}>
              <Speedometer
                value={temp}
                totalValue={100}
                size={windowWidth - 70}
                showIndicator={true}
                // outerColor="#fff"
                internalColor={rangColor}
                // innerColor="#292d4e00"
                indicatorColor="#fff"
              />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "600",
                  marginTop: 5,
                  // color:"#2596ff"
                }}
              >
                Temp : {temp} °C ( {data_result_temp} )
              </Text>

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
          </View>
          {/* temp value */}
          {/* <View style={styles.box_chart4}>
           
            <View style={styles.box}>
              <Speedometer
                value={temp}
                totalValue={100}
                size={windowWidth - 70}
                showIndicator
                outerColor="#e6e6e6"
                // outerColor="#fff"
                internalColor={rangColor}
                // innerColor="#292d4e00"
                indicatorColor="#fff"
              />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "600",
                  marginTop: 5,
                  // color:"#2596ff"
                }}
              >
                Temp : {temp} °C ( {data_result_temp} )
              </Text>

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
          </View> */}
          {/* 3 value part2 */}
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
    paddingBottom: 20,
    marginBottom: 50,
  },
  btn_time: {
    position: "absolute",
    zIndex: 10,
    right: 0,
    width: "15%",
    backgroundColor: "#448fff",
    height: 50,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
  },
  box_chart1: {
    backgroundColor: "#006b0593",
    marginBottom: 10,
    display: "flex",
    // flexDirection: "col",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingTop: 10,
    width: windowWidth - 20,
  },
  box_chart2: {
    backgroundColor: "#000b6b93",
    marginBottom: 10,
    display: "flex",
    // flexDirection: "col",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingTop: 10,
    width: windowWidth - 20,
  },
  box_chart3: {
    backgroundColor: "#23767c93",
    marginBottom: 10,
    display: "flex",
    // flexDirection: "col",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingTop: 10,
    width: windowWidth - 20,
  },
  box_chart4: {
    backgroundColor: "#7c232393",
    marginBottom: 10,
    display: "flex",
    // flexDirection: "col",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingTop: 10,
    width: windowWidth - 20,
  },
  box: {
    width: "100%",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
    marginTop: 10,
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
