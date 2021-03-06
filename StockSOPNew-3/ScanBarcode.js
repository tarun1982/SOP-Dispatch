import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, Button } from 'react-native';
import { RNCamera } from 'react-native-camera';

export default class ScanBarCode extends Component {
	state = {
		isScanned: false
	};

	constructor(props) {
		super(props);
		this.camera = null;
		this.barCode = null;

		this.state = {
			camera: {
				type: RNCamera.Constants.Type.back,
				flashMode: RNCamera.Constants.FlashMode.auto,
				barCodeFinderVisible: true
			}
		};
	}

	onBarCodeRead(scanResult) {
		console.warn(scanResult.type);
		console.warn(scanResult.data);
		if (scanResult.data != null) {
			if (!this.state.isScanned) {
				this.state.isScanned = true;
				this.props.route.params.onItemScanned(scanResult.data);
				this.props.navigation.goBack();
			}
		}
	}

	async takePicture() {
		if (this.camera) {
			const options = { quality: 0.5, base64: true };
			const data = await this.camera.takePictureAsync(options);
			console.log(data.uri);
		}
	}

	pendingView() {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: 'lightgreen',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<Text>Waiting</Text>
			</View>
		);
	}

	render() {
		return (
			<View style={styles.container}>
				<RNCamera
					ref={ref => {
						this.camera = ref;
					}}
					barcodeFinderVisible={this.state.camera.barcodeFinderVisible}
					barcodeFinderWidth={280}
					barcodeFinderHeight={220}
					barcodeFinderBorderColor="black"
					barcodeFinderBorderWidth={2}
					defaultTouchToFocus
					flashMode={this.state.camera.flashMode}
					mirrorImage={false}
					onBarCodeRead={this.onBarCodeRead.bind(this)}
					onFocusChanged={() => {}}
					onZoomChanged={() => {}}
					permissionDialogTitle={'Permission to use camera'}
					permissionDialogMessage={'We need your permission to use your camera phone'}
					style={styles.preview}
					type={this.state.camera.type}
				/>
				<View style={[styles.overlay, styles.topOverlay]}>
					<Text style={styles.scanScreenMessage}>Please scan the barcode.</Text>
				</View>
				<View
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<View
						style={{
							height: '15%',
							width: '70%',
							borderColor: 'white',
							borderWidth: 1
						}}
					/>
				</View>
			</View>
		);
	}
}

const styles = {
	container: {
		flex: 1
	},
	preview: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	overlay: {
		position: 'absolute',
		padding: 16,
		right: 0,
		left: 0,
		alignItems: 'center'
	},
	topOverlay: {
		top: 0,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	bottomOverlay: {
		bottom: 0,
		backgroundColor: 'rgba(0,0,0,0.4)',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	enterBarcodeManualButton: {
		padding: 15,
		backgroundColor: 'white',
		borderRadius: 40
	},
	scanScreenMessage: {
		fontSize: 14,
		color: 'white',
		textAlign: 'center',
		alignItems: 'center',
		justifyContent: 'center'
	}
};
