import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Alert,
    ActivityIndicator,
    Button,
    TextInput
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';

export default class HomeScreen extends Component {
    // static navigationOptions = ({ navigation }) => {
    //     return {
    //         title: "Stage-21 ",
    //         headerRight: (
    //             <TouchableOpacity
    //                 onPress={() => {
    //                     const resetAction = StackActions.reset({
    //                         index: 0,
    //                         actions: [
    //                             NavigationActions.navigate({
    //                                 routeName: "Login"
    //                             })
    //                         ]
    //                     });
    //                     navigation.dispatch(resetAction);
    //                 }}
    //             >
    //                 <Text
    //                     style={{
    //                         color: "white",
    //                         paddingRight: 16,
    //                         fontSize: 18
    //                     }}
    //                 >
    //                     Logout
    //                 </Text>
    //             </TouchableOpacity>
    //         )
    //     };
    // };

    constructor(props) {
        super(props);
        this.findCoordinates = this.findCoordinates.bind(this);
        this.state = {
            usersName: props.route.params.name,
            userID: props.route.params.user,
            barcodeNumber: "Scan Barcode",
            totalCount: 0,
            scanData: [],
            loading: true,
            showInvoiceView: false,
            itemID: "",
    
            mapRegion: "",
            lastLat: "",
            lastLong: "",
            invoiceGenerate: 0,
            transporterName: "",
            supplyPlace: "",
            vehicleNo: ""
        };
    }

    componentDidMount() {
        this.loadScanHistory();
        this.findCoordinates();
    }

    findCoordinates = () => {
        Geolocation.getCurrentPosition(info => {
            console.warn(info);
           this.setState({
               lastLat: info.coords.latitude,
               lastLong: info.coords.longitude
           })
        })
    };

    onRegionChange(region, lat, long) {
        this.setState({
            mapRegion: region,
            lastLat: lat,
            lastLong: long
        });
    }

    _retrieveData = async key => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                // We have data!!
                console.log(value);
                return value;
            }
        } catch (error) {
            // Error retrieving data
            console.warn(error);
        }
    };

    _renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#CED0CE"
                }}
            />
        );
    };

    loadScanHistory() {
        this.setState({ loading: true });
        fetch(
            "http://sop.sparklemanufacturing.com/customers/customerItems.json?user_id=" +
                this.state.userID
        )
            .then(response => response.json())
            .then(responseJson => {
                console.warn(responseJson);
                this.setState({ loading: false });
                if (!responseJson.error) {
                    this.setState({ scanData: responseJson.data });
                } else {
                    Alert.alert(
                        "SOP Alert",
                        JSON.stringify(responseJson.message)
                    );
                }
            })
            .catch(error => {
                this.setState({ loading: false });
                Alert.alert("SOP Alert", error);
            });
    }

    scanAPI(scanItem) {
        this.setState({ loading: true });
        let params = {
            serial_number: scanItem,
            user_id: this.state.userID,
            latitude: this.state.lastLat,
            longitude: this.state.lastLong,
            invoice_generate: this.state.invoiceGenerate,
            transporter_name: this.state.transporterName,
            place_of_supply: this.state.supplyPlace,
            vehicle_no: this.state.vehicleNo,
        };
        console.warn(params);
        fetch(
            "http://sop.sparklemanufacturing.com/customers/addCustomerItems.json",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(params)
            }
        )
            .then(response => response.json())
            .then(responseJson => {
                this.setState({ loading: false, showInvoiceView: false });
                console.warn(responseJson);
                this.loadScanHistory();
            });
    }

    _keyExtractor = (item, index) => {
        item.id;
    };

    renderInvoiceView() {
        return (
            <View
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <View
                    style={{
                        backgroundColor: "white",
                        borderRadius: 12,
                        padding: 16,
                        width: "80%"
                    }}
                >
                    <Text style={{ fontWeight: "bold" }}>Transporter Name</Text>
                    <TextInput
                        style={{ marginTop: 8 }}
                        placeholder={"Enter transporter name"}
                        autoCapitalize
                        onChangeText={text =>
                            this.setState({ transporterName: text })
                        }
                    />
                    <View
                        style={{
                            width: "100%",
                            height: 1,
                            backgroundColor: "black",
                            opacity: 0.8,
                            alignSelf: "center"
                        }}
                    />
                    <Text style={{ marginTop: 16, fontWeight: "bold" }}>
                        Supply Place
                    </Text>
                    <TextInput
                        style={{ marginTop: 8 }}
                        placeholder={"Enter place name"}
                        autoCapitalize
                        onChangeText={text =>
                            this.setState({ supplyPlace: text })
                        }
                    />
                    <View
                        style={{
                            width: "100%",
                            height: 1,
                            backgroundColor: "black",
                            opacity: 0.8,
                            alignSelf: "center"
                        }}
                    />
                    <Text style={{ marginTop: 16, fontWeight: "bold" }}>
                        Vehicle No.
                    </Text>
                    <TextInput
                        style={{ marginTop: 8 }}
                        placeholder={"Enter Vehicle No."}
                        autoCapitalize
                        onChangeText={text =>
                            this.setState({ vehicleNo: text })
                        }
                    />
                    <View
                        style={{
                            width: "100%",
                            height: 1,
                            backgroundColor: "black",
                            opacity: 0.8,
                            alignSelf: "center"
                        }}
                    />
                    <View
                        style={{
                            marginVertical: 12,
                            flexDirection: "row",
                            justifyContent: "space-around"
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                marginRight: 10,
                                alignItems: "center"
                            }}
                            onPress={() =>
                                this.setState({
                                    showInvoiceView: false,
                                    invoiceGenerate: 0
                                })
                            }
                        >
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                marginLeft: 10,
                                alignItems: "center"
                            }}
                            onPress={() => {
                                if (this.state.transporterName.length == 0) {
                                    Alert.alert(
                                        "Alert",
                                        "Please Enter Transporter Name"
                                    );
                                } else if (this.state.supplyPlace.length == 0) {
                                    Alert.alert(
                                        "Alert",
                                        "Please Enter Supply Place"
                                    );
                                } else if (this.state.vehicleNo.length == 0) {
                                    Alert.alert(
                                        "Alert",
                                        "Please Enter Vehicle No."
                                    );
                                } else {
                                    this.scanAPI(this.state.itemID);
                                }
                            }}
                        >
                            <Text style={{ color: "blue" }}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    logout=()=> {
        AsyncStorage.clear()
        this.props.navigation.navigate('Login')
    }

    render() {
        return (
            <View style={styles.container}>
                <View
                    style={{
                        width: "100%",
                        height: "10%",
                        backgroundColor: "#3986b2",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                     
                >
                    <Text style={styles.stageName}>{this.state.usersName}</Text>
                
                <TouchableOpacity
                                style={{
                                    height: 30,
                                    width: "20%",
                                    backgroundColor: "#3986B2",
                                    justifyContent: "center",
                                    marginLeft: "auto",
                                    marginTop: "5%",
                                    borderRadius: 8
                                }}
                                onPress={()=> this.logout() }
                                
                            >
                                <Text
                                    style={{ color: "#FFFFFF", fontSize: 20 }}
                                >
                                    Logout
                                </Text>
                            </TouchableOpacity>
                 </View>
                <TouchableOpacity
                    style={{
                        height: "8%",
                        width: "100%",
                        margin: 8,
                        justifyContent: "center",
                        alignItems: "center",
                        borderWidth: 2,
                        borderColor: "#00000030",
                        borderRadius: 20
                    }}
                    onPress={() => {
                        this.props.navigation.navigate("ScanBarCode", {
                            onItemScanned: itemID => {
                                this.setState({ itemID });
                                // let alreadyScanned = this.state.scanData(
                                //     item => item.job_item.serial_no == itemID
                                // );
                                let alreadyScanned = this.state.scanData.filter(
                                    item => item.job_item.serial_no == itemID
                                );
                                if (alreadyScanned.length != 0) {
                                    this.state.invoiceGenerate = 0;
                                    this.scanAPI(itemID);
                                } else {
                                    Alert.alert(
                                        "Alert",
                                        "Do you want to to generate invoice ?",
                                        [
                                            {
                                                text: "Yes",
                                                onPress: () => {
                                                    this.setState({
                                                        showInvoiceView: true,
                                                        invoiceGenerate: 1
                                                    }
                                                    );
                                                }
                                            },
                                            {
                                                text: "No",
                                                onPress: () => {
                                                    this.state.invoiceGenerate = 0;
                                                    this.scanAPI(itemID);
                                                }
                                            }
                                        ]
                                    );
                                }
                            }
                        });
                    }}
                >
                    <Text>{this.state.barcodeNumber}</Text>
                </TouchableOpacity>
                <Text
                    style={{
                        width: "100%",
                        textAlign: "right",
                        padding: 8,
                        color: "#3986B2"
                    }}
                >
                    Total Count - {this.state.scanData.length}
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        width: "100%",
                        height: 50,
                        backgroundColor: "#3986B2",
                        alignItems: "center"
                    }}
                >
                    <Text style={{ ...styles.listText, width: "50%" }}>
                        PSR No.
                    </Text>
                    <Text style={styles.listText}>Date-In</Text>
                    <Text style={styles.listText}>Date-Out</Text>
                </View>
                <FlatList
                    style={{ width: "100%" }}
                    data={this.state.scanData}
                    keyExtractor={this._keyExtractor}
                    ItemSeparatorComponent={this._renderSeparator}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                flexDirection: "row",
                                width: "100%",
                                height: 50,
                                alignItems: "center"
                            }}
                        >
                            <Text
                                style={{
                                    ...styles.listText,
                                    width: "50%",
                                    color: "black",
                                    borderRightWidth: 0.5
                                }}
                            >
                                {" "}
                                {item.job_item.serial_no}
                            </Text>
                            <Text
                                style={{
                                    ...styles.listText,
                                    color: "black",
                                    borderRightWidth: 0.5
                                }}
                            >
                                {item.date_in.substring(0, 10)}
                            </Text>
                            <Text
                                style={{ ...styles.listText, color: "black" }}
                            >
                                {item.date_out &&
                                    item.date_out.substring(0, 10)}
                            </Text>
                        </View>
                    )}
                />
                {this.state.showInvoiceView && this.renderInvoiceView()}
                {this.state.loading && (
                    <View style={styles.loadingView}>
                        <ActivityIndicator size="large" color="white" />
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    stageName: {
        fontSize: 16,
        color: "white",
        textAlign: "center"
    },
    listText: {
        width: "25%",
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    instructions: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5
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
