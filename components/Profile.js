import React, { useContext } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { Button, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { AuthContext } from "../constants/Context";

const Profile = ({ route, navigation }) => {
  const { itemId } = route.params;
  const { signOut } = useContext(AuthContext);
  return (
    <View style={styles.head}>
      <View>
        <Text style={styles.text}>{itemId}</Text>
        <Button
          icon={
            <Icon
              name={itemId == null ? "sign-in" : "sign-out"}
              size={18}
              color="#fff"
            />
          }
          title={itemId === null ? " เข้าสู่ระบบ" : "  ออกจากระบบ"}
          containerStyle={{
            width: "100%",
            height: 40,
            fontSize: 10,
          }}
          buttonStyle={{
            backgroundColor: itemId === null ? "#339933" : "#585858",
            fontSize: 10,
          }}
          onPress={() => {
            itemId === null
              ? signOut()
              : Alert.alert("ออกจากระบบ", "ยืนยันออกจากระบบ", [
                  { text: "ยืนยัน", onPress: () => signOut() },
                  { text: "ยกเลิก" },
                ]);
            console.log("logout");
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  head: {
    display: "flex",
    backgroundColor: "#671eee",
    height: "100%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
});
export default Profile;
