import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

export default class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            loading: false
        };
    }

    isValidate = () => {
        if (this.state.email.length == 0) {
            Alert.alert("SOP Alert", "Please enter Email");
        } else if (this.state.password.length == 0) {
            Alert.alert("SOP Alert", "Please enter Password");
        } else {
            this.loginApiCall();
        }
    };

    loginApiCall() {
        this.setState({ loading: true });
        fetch("http://sop.sparklemanufacturing.com/adminUsers/loginApp.json", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        })
            .then(response => response.json())
            .then(responseJson => {
                console.warn(responseJson);
                error = responseJson.error;
                this.setState({ loading: false });
                if (!error) {
                    userID = responseJson.data.id;
                    name = responseJson.data.name;
                    if (responseJson.data.role == "customer") {
                        this.presentHomeScreen({
                            user: userID,
                            email: this.state.email,
                            name: name
                        });
                    } else {
                        Alert.alert("SOP Alert", "Incorrect Email or Password");
                    }
                } else {
                    Alert.alert(
                        "SOP Alert",
                        JSON.stringify(responseJson.message)
                    );
                }
            })
            .catch(error => {
                this.setState({ loading: false });
                Alert.alert("SOP Alert", error.toString());
            });
    }

    _storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            // Error saving data
            console.warn(error);
        }
    };

    presentHomeScreen(params) {
        this.props.navigation.navigate('Home',params)
    }
    render() {
        return (
            <View style={styles.container}>
                <ImageBackground
                    style={styles.backgroundImage}
                    source={require("./Resources/background.jpg")}
                >
                    <View style={styles.mainView}>
                        <View style={styles.titleView}>
                            <Text
                                style={{
                                    fontSize: 32,
                                    fontWeight: "bold",
                                    color: "#434343"
                                }}
                            >
                                SOP
                            </Text>
                            <Text style={{ fontSize: 32, color: "#00000080" }}>
                                {" "}
                                - Stock
                            </Text>
                        </View>

                        <Text
                            style={{
                                color: "#00000080",
                                marginTop: 8,
                                fontSize: 16,
                                width: "100%",
                                textAlign: "center"
                            }}
                        >
                            Sign-in to see your Stock
                        </Text>

                        <Text
                            style={{
                                color: "#00000080",
                                marginTop: 16,
                                fontSize: 18
                            }}
                        >
                            Email/Username
                        </Text>
                        <TextInput
                            style={styles.textInputStyle}
                            onChangeText={text => {
                                this.setState({ email: text });
                            }}
                            value={this.state.email}
                            keyboardType="email-address"
                            returnKeyType="next"
                            placeholder="Enter Username/Email"
                        />

                        <Text
                            style={{
                                color: "#00000080",
                                marginTop: 16,
                                fontSize: 18
                            }}
                        >
                            Password
                        </Text>
                        <TextInput
                            style={styles.textInputStyle}
                            onChangeText={text => {
                                this.setState({ password: text });
                            }}
                            value={this.state.password}
                            placeholder="Enter Password"
                            returnKeyType="done"
                            secureTextEntry
                        />
                        <View
                            style={{
                                flexDirection: "row",
                                width: "100%",
                                flex: 1,
                                alignItems: "flex-end",
                                justifyContent: "flex-end",
                                marginTop: 16,
                                marginBottom: 16
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    height: 32,
                                    width: "40%",
                                    backgroundColor: "#3986B2",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 8
                                }}
                                onPress={this.isValidate}
                            >
                                <Text
                                    style={{ color: "#FFFFFF", fontSize: 16 }}
                                >
                                    Sign In
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {this.state.loading && (
                        <View style={styles.loadingView}>
                            <ActivityIndicator size="large" color="white" />
                        </View>
                    )}
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    backgroundImage: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    mainView: {
        height: "48%",
        width: "90%",
        backgroundColor: "white",
        borderRadius: 10,
        paddingLeft: 16,
        paddingRight: 16
    },
    titleView: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
        marginTop: 8
    },
    textInputStyle: {
        borderBottomColor: "#00000080",
        borderWidth: 0.5,
        marginTop: 4,
        borderRadius: 8,
        height: 40,
        padding: 4
    },
    loadingView: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#00000040",
        alignItems: "center",
        justifyContent: "center"
    }
});
