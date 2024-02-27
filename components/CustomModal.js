import React from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const CustomModal = ({ isVisible, onDismiss, title, children, onConfirm, onCancel, confirmText = 'OK', cancelText = 'Cancel', showCancelButton = false }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onDismiss}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <View style={styles.modalContent}>
                        {children}
                    </View>

                    {showCancelButton && (
                        <View style={[
                            styles.buttonContainer,
                            showCancelButton ? {} : styles.centerButton
                        ]}>

                            <TouchableOpacity onPress={onCancel} style={[styles.button, styles.buttonCancel]}>
                                <Text style={styles.textStyle}>{cancelText}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={onConfirm} style={[styles.button, styles.buttonConfirm]}>
                                <Text style={styles.textStyle}>{confirmText}</Text>
                            </TouchableOpacity>
                        </View>)}
                    {!showCancelButton && (
                        <TouchableOpacity onPress={onConfirm} style={[styles.button, styles.buttonConfirm]}>
                            <Text style={styles.textStyle}>{confirmText}</Text>
                        </TouchableOpacity>)}


                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
    },
    modalContent: {
        marginBottom: 15,

    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
    },
    centerButton: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',

    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        minWidth: 100,
        marginHorizontal: 5,
    },
    buttonCancel: {
        backgroundColor: '#2196F3',
    },
    buttonConfirm: {
        backgroundColor: '#F44336',
    },
    centerSingleButton: {
        marginHorizontal: 'auto',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default CustomModal;
