import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Dimensions, ScrollView } from "react-native";
import moment from "moment";
import DateRangePicker from "react-native-daterange-picker";
import Speedometer from "react-native-speedometer-chart";
import axios from "axios";
import { LineChart } from "react-native-chart-kit";
//import { api } from "../constants/Api";
import { api_main } from "../../constants/Api_main";
import { api_path } from "../../constants/Api_path";

import RNPickerSelect from "react-native-picker-select";

const windowWidth = Dimensions.get("window").width;
var dateRange;
const Brix = ({ start, end, itemId, time_select }) => {
  const dateStart = JSON.stringify(start);
  const dateEnd = JSON.stringify(end);
  const resultdateStart = dateStart.slice(1, dateStart.length - 1);
  const resultdateEnd = dateEnd.slice(1, dateEnd.length - 1);

  const [brix_line, setBrix_line] = useState(0);
  const [brix_line_max, setBrix_line_min] = useState(0);
  const [brix_line_min, setBrix_line_max] = useState(0);
  const [brix_y, setBrix_y] = useState(0);

  //   console.log("dateRange", values);
  //   "endDate": "2022-08-26T10:01:40.626Z", "startDate": "2022-08-01T10:01:40.626Z"

  useEffect(() => {
    get_brixline(start, end);
  }, [end]);

  const get_brixline = async (start, end) => {
    let URL1 =
      "http://203.159.93.64:5001/brixline/undefined/2022-08-20T11:20:52.945Z/2022-08-20T11:20:52.945Z/5m";
    let URL2 =
      "http://203.159.93.64:5001/brixline/undefined/2022-08-20T11:20:52.945Z/2022-08-20T11:20:52.945Z/5m";
    let URL3 =
      "http://203.159.93.64:5001/brixline/undefined/2022-08-20T11:20:52.945Z/2022-08-20T11:20:52.945Z/5m";

    const promise1 = await axios.get(URL1);
    const promise2 = await axios.get(URL2);
    const promise3 = await axios.get(URL3);
    // console.log("get_brixline");

    await Promise.all([promise1, promise2, promise3]).then(function (values) {
      values.forEach((element) => {
        // console.log("value", element.data);
      });
    });

    // console.log("start", resultdateStart);
    // console.log("end", resultdateEnd);

    // await axios
    //   .get(
    //     api_main.main_brix +
    //       api_path.brixlinemin +
    //       itemId +
    //       "/" +
    //       resultdateStart +
    //       "/" +
    //       resultdateEnd
    //   )
    //   .then(function (response) {
    //     // const data = response.data.data[0].min;
    //     // const data_array = response.data.data;
    //     // data
    //     //   ? setBrix_line_min(
    //     //       data_array.map((index) => {
    //     //         return index.min;
    //     //       })
    //     //     )
    //     //   : undefined;
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
    // await axios
    //   .get(
    //     api_main.main_brix +
    //       api_path.brixlinemax +
    //       itemId +
    //       "/" +
    //       resultdateStart +
    //       "/" +
    //       resultdateEnd
    //   )
    //   .then(function (response) {
    //     // const data = response.data.data[0].max;
    //     // const data_array = response.data.data;
    //     // data
    //     //   ? setBrix_line_max(
    //     //       data_array.map((index) => {
    //     //         return index.max;
    //     //       })
    //     //     )
    //     //   : undefined;
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  };

  return (
    <View>
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
    height: 53,
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

export default Brix;
