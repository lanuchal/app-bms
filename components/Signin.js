import React, { useState, useContext } from "react";
import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  View,
  // Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  ThemeProvider,
  Button,
  Input,
  Image,
  Text,
} from "react-native-elements";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";
import { api } from "../constants/Api";
import { AuthContext } from "../constants/Context";
import Loadpage from "./Loadpage";

import { Dimensions } from "react-native";

const windowHeight = Dimensions.get("window").height;
var imgH = 180;
var imgW = 180;
var fontH = 22;
var fontS = 16;
if (windowHeight <= 670) {
  imgH = 120;
  imgW = 120;
  fontH = 18;
  fontS = 15;
}

const Signin = ({ route, navigate, navigation }) => {
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [isLoading_log, setIsLoading_log] = useState(true);

  const { signIn, setUserID, home } = useContext(AuthContext);

  const registerUser = (data) => {
    return fetch(api.main + "api/users/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((apiResponse) => {
        return apiResponse;
      })
      .catch(function (error) {
        return error;
      });
  };

  const createTwoButtonAlert = () =>
    Alert.alert("เกิดข้อผิดพลาด", "กรุณากรอกข้อมูล", [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  const checkLogin = async () => {
    if (!userName || !passWord) {
      createTwoButtonAlert();
      // console.log("errorrrrrr");
    } else {
      setIsLoading_log(false);
      console.log("userName = " + userName);
      console.log("passWord = " + passWord);
      let data = {
        username: userName,
        password: passWord,
      };

      registerUser(data)
        .then((response) => {
          const userid = response.id;
          const user = response.username;
          const pass = response.password;
          if (!userid) {
            console.log("undefined");
            Alert.alert("เกิดข้อผิดพลาด", "รหัสผ่านไม่ถูกต้อง", [
              {
                text: "OK",
                onPress: () => {
                  setIsLoading_log(true);
                  // setPtop(40);
                  home();
                },
              },
            ]);
          } else {
            setUserID(userid);
            signIn(user, userName, pass, passWord, userid);
          }
        })
        .catch((error) => {
          console.log("error " + error);
          Alert.alert("เกิดข้อผิดพลาด", "สัญาณอินเทอร์ขัดข้อง", [
            {
              text: "OK",
              onPress: () => {
                setIsLoading_log(true);
              },
            },
          ]);
        });
    }
  };

  if (!isLoading_log) {
    return <Loadpage />;
  }
  return (
    <ThemeProvider theme={theme}>
      <View style={styles.head}>
        <Icon name="lock" size={18} color="#fff" />
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#fff",
            marginLeft: 10,
            marginBottom: 5,
          }}
        >
          เข้าสู่ระบบ
        </Text>
      </View>
      <View style={styles.box}>
        <ScrollView style={styles.container}>
          <Input
            leftIcon={<Icon name="user" size={20} color="#671eee" />}
            placeholder={"Username"}
            inputStyle={{ paddingLeft: 10, paddingTop: -20 }}
            onChangeText={(userName) => setUserName(userName)}
          />
          <Input
            leftIcon={<Icon name="key" size={20} color="#671eee" />}
            secureTextEntry={true}
            placeholder={"Password"}
            inputStyle={{ paddingLeft: 10 }}
            onChangeText={(passWord) => setPassWord(passWord)}
          />
          <Button
            icon={<Icon name="sign-in" size={20} color="#fff" />}
            title="   Sign in"
            containerStyle={{ marginTop: 10 }}
            buttonStyle={{ backgroundColor: "#671eee" }}
            onPress={() => checkLogin(this)}
          />
        </ScrollView>
      </View>
    </ThemeProvider>
  );
};

const theme = {
  Button: {
    raised: false,
  },
};

const styles = StyleSheet.create({
  box: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    height: "90%",
    width: "100%",
  },
  container: {
    flex: 1,
    padding: 35,
  },
  head: {
    display: "flex",
    backgroundColor: "#671eee",
    height: "15%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headVG: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
});

export default Signin;
