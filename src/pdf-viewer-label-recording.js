import {
  Document,
  Page,
  Image,
  View,
  Text,
  Font,
  StyleSheet,
} from '@react-pdf/renderer';
import JsBarcode from 'jsbarcode';
Font.register({
  family: 'Arimo-Bold',
  src: '/Arimo-Bold.ttf',
});
Font.register({
  family: 'Arimo-Regular',
  src: '/Arimo-Regular.ttf',
});

const styles = StyleSheet.create({
  page: {
    overflow: 'hidden',
    display: 'flex',
    alignContent: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    opacity: 0,
    height: '100%',
    width: '100%',
  },
  barcodeWidth: {
    marginTop: 5,
    width: '25%',
    opacity: 1,
    marginBottom: 10,
  },
  multipurposeLabelWidth: {
    width: '75%',
    opacity: 1,
    marginTop: 3,
    marginBottom: 0,
  },
  halfWidth: {
    width: '49%',
    height: '100%',
    opacity: 0,
  },
  fullWidth: {
    width: '100%',
    opacity: 0,
    display: 'flex',
    alignContent: 'flex-start',
    flexDirection: 'row',
  },
  mainText: {
    marginTop: '3px',
    marginLeft: '6px',
    width: '100%',
  },
  leftMargin: {
    marginTop: '3px',
    marginLeft: '12px',
    width: '100%',
  },
  largeLeftMargin: {
    color: 'black',
    marginLeft: '18px',
    marginRight: '6px',
    width: '100%',
  },
  text: {
    color: 'black',
    fontFamily: 'Times-Roman',
    opacity: 1,
    fontSize: 12,
    fontWeight: 500,
  },
  textSmall: {
    color: 'black',
    fontFamily: 'Arimo-Bold',
    opacity: 1,
    fontSize: 5,
  },
  textMedium: {
    color: 'black',
    fontFamily: 'Arimo-Regular',
    opacity: 1,
    fontSize: 7,
    fontWeight: 700,
  },
  textLarge: {
    color: 'black',
    fontFamily: 'Arimo-Bold',
    opacity: 1,
    fontSize: 10,
    fontWeight: 700,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#3b3b3b',
    borderBottomStyle: 'solid',
  },
});

export const RecordingLabelPdf = (props) => {
  //const { record, county, type, hasSignature } = props;

  const getBarcodeRecordingLabel5 = (id) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const tempCanvas = document.createElement('canvas');
    JsBarcode(tempCanvas, id, {
      format: 'CODE128',
      height: 100,
      width: 5,
      fontOptions: 'bold',
      displayValue: false,
    });
    canvas.width = tempCanvas.height;
    canvas.height = tempCanvas.width;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(
      tempCanvas,
      -tempCanvas.width / 2,
      -tempCanvas.height / 2,
    );
    const barcode = canvas.toDataURL();
    return barcode;
  };

  Font.registerHyphenationCallback((word) => [word]);

    return (
      <Document>
        <Page size={[250, 85]} style={styles.page}>
          <View
            style={[
              styles.barcodeWidth,
              styles.justifyContent,
              {
                alignSelf: 'center',
                width: '12%',
                marginLeft: 30,
              },
            ]}>
            <Image
              style={{ opacity: 1, padding: 0 }}
              src={getBarcodeRecordingLabel5(0)}></Image>
          </View>
          <View style={styles.multipurposeLabelWidth}>
            <View style={[{ width: '100%' }]}>
              <View
                style={[
                  styles.justifyContent,
                  {
                    alignItems: 'center',
                    width: '100%',
                    flexDirection: 'row',
                  },
                ]}>
                <View
                  style={[
                    styles.justifyContent,
                    { alignItems: 'left', width: '75%' },
                  ]}>
                  <Text
                    style={{
                      fontSize: 8,
                      color: 'black',
                      fontFamily: 'Arimo-Bold',
                      opacity: 1,
                      fontWeight: 700,
                      textAlign: 'left',
                    }}>
                    {`Book/Page: 0/0-0 (0)`}
                  </Text>
                </View>
                <View
                  style={[
                    styles.justifyContent,
                    {
                      alignItems: 'right',
                      width: '25%',
                    },
                  ]}>
                  <Text
                    style={{
                      fontSize: 8,
                      color: 'black',
                      fontFamily: 'Arimo-Bold',
                      opacity: 1,
                      fontWeight: 700,
                      textAlign: 'right',
                    }}>{`0`}</Text>
                </View>
              </View>
              <View
                style={[{ width: '100%', flexDirection: 'row' }]}>
                <View
                  style={[
                    {
                      width: '50%',
                      marginRight: 5,
                      flexDirection: 'column',
                    },
                  ]}>
                  <View
                    style={[
                      styles.justifyContent,
                      styles.bottomBorder,
                      { alignItems: 'left' },
                    ]}>
                    <Text
                      style={{
                        fontSize: 5,
                        color: 'black',
                        fontFamily: 'Arimo-Regular',
                        opacity: 1,
                        textAlign: 'left',
                      }}>{`0 PG(s): 0`}</Text>
                  </View>
                  <View
                    style={[
                      styles.justifyContent,
                      styles.bottomBorder,
                      {
                        flexDirection: 'row',
                        width: '100%',
                      },
                    ]}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 5,
                          color: 'black',
                          fontFamily: 'Arimo-Regular',
                          opacity: 1,
                          textAlign: 'left',
                        }}>{`By: fatch`}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.justifyContent,
                      styles.bottomBorder,
                      {
                        flexDirection: 'row',
                        width: '100%',
                      },
                    ]}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                      <View
                        style={{ flexDirection: 'row', flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 5,
                            color: 'black',
                            fontFamily: 'Arimo-Regular',
                            opacity: 1,
                            textAlign: 'left',
                          }}>{`ORDER:`}</Text>
                      </View>
                      <View style={{ width: 'auto' }}>
                        <Text
                          style={{
                            fontSize: 5,
                            color: 'black',
                            fontFamily: 'Arimo-Regular',
                            opacity: 1,
                            textAlign: 'right',
                          }}>{''}</Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.justifyContent,
                      styles.bottomBorder,
                      {
                        flexDirection: 'row',
                        width: '100%',
                      },
                    ]}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 5,
                          color: 'black',
                          fontFamily: 'Arimo-Regular',
                          opacity: 1,
                          textAlign: 'left',
                        }}>{`VALUE`}</Text>
                    </View>
                    <View style={{ width: 'auto' }}>
                      <Text
                        style={{
                          fontSize: 5,
                          color: 'black',
                          fontFamily: 'Arimo-Regular',
                          opacity: 1,
                          textAlign: 'right',
                        }}>{`${
                        ('') +
                        '' +
                        ('')
                      }`}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.justifyContent,
                      styles.bottomBorder,
                      {
                        flexDirection: 'row',
                        width: '100%',
                      },
                    ]}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 5,
                          color: 'black',
                          fontFamily: 'Arimo-Regular',
                          opacity: 1,
                          textAlign: 'left',
                        }}>{`MORTGAGE TAX`}</Text>
                    </View>
                    <View style={{ width: 'auto' }}>
                      <Text
                        style={{
                          fontSize: 5,
                          color: 'black',
                          fontFamily: 'Arimo-Regular',
                          opacity: 1,
                          textAlign: 'right',
                        }}>{`$0.00`}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.justifyContent,
                      styles.bottomBorder,
                      {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                      },
                    ]}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 5,
                          color: 'black',
                          fontFamily: 'Arimo-Regular',
                          opacity: 1,
                          textAlign: 'left',
                        }}>{`TRANSFER TAX`}</Text>
                    </View>
                    <View style={{ width: 'auto' }}>
                      <Text
                        style={{
                          fontSize: 5,
                          color: 'black',
                          fontFamily: 'Arimo-Regular',
                          opacity: 1,
                          textAlign: 'right',
                        }}>{`$0.00`}</Text>
                    </View>
                  </View>
                </View>
                <View
                  style={[
                    { width: '50%', flexDirection: 'column' },
                  ]}>
                  <View
                    style={[
                      styles.justifyContent,
                      styles.bottomBorder,
                      {
                        width: '100%',
                      },
                    ]}>
                    <View style={{ width: 'auto' }}>
                      <Text
                        style={{
                          fontSize: 5,
                          color: 'black',
                          fontFamily: 'Arimo-Regular',
                          opacity: 1,
                          textAlign: 'right',
                        }}>{`${new Date().toLocaleString()}`}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.justifyContent,
                      styles.bottomBorder,
                      {
                        flexDirection: 'row',
                        width: '100%',
                      },
                    ]}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 5,
                          color: 'black',
                          fontFamily: 'Arimo-Regular',
                          opacity: 1,
                          textAlign: 'left',
                        }}>{`RECORDING FEE`}</Text>
                    </View>
                    <View style={{ width: 'auto' }}>
                      <Text
                        style={{
                          fontSize: 5,
                          color: 'black',
                          fontFamily: 'Arimo-Regular',
                          opacity: 1,
                          textAlign: 'right',
                        }}>{`$0.00`}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.justifyContent,
                      styles.bottomBorder,
                      {
                        flexDirection: 'row',
                        width: '100%',
                      },
                    ]}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 5,
                          color: 'black',
                          fontFamily: 'Arimo-Regular',
                          opacity: 1,
                          textAlign: 'left',
                        }}>{`ARCHIVE FEE`}</Text>
                    </View>
                    <View style={{ width: 'auto' }}>
                      <Text
                        style={{
                          fontSize: 5,
                          color: 'black',
                          fontFamily: 'Arimo-Regular',
                          opacity: 1,
                          textAlign: 'right',
                        }}>{`$0.00`}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.justifyContent,
                      styles.bottomBorder,
                      {
                        flexDirection: 'row',
                        width: '100%',
                      },
                    ]}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 5,
                          color: 'black',
                          fontFamily: 'Arimo-Regular',
                          opacity: 1,
                          textAlign: 'right',
                        }}>{`DP FEE`}</Text>
                    </View>
                    <View style={{ width: 'auto' }}>
                      <Text
                        style={{
                          fontSize: 5,
                          color: 'black',
                          fontFamily: 'Arimo-Regular',
                          opacity: 1,
                          textAlign: 'right',
                        }}>{`$0.00`}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.justifyContent,
                      styles.bottomBorder,
                      {
                        flexDirection: 'row',
                        width: '100%',
                      },
                    ]}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 5,
                          color: 'black',
                          fontFamily: 'Arimo-Regular',
                          opacity: 1,
                          textAlign: 'left',
                        }}>{`REGISTER'S FEE`}</Text>
                    </View>
                    <View style={{ width: 'auto' }}>
                      <Text
                        style={{
                          fontSize: 5,
                          color: 'black',
                          fontFamily: 'Arimo-Regular',
                          opacity: 1,
                          textAlign: 'right',
                        }}>{`$0.00`}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.justifyContent,
                      styles.bottomBorder,
                      {
                        flexDirection: 'row',
                        width: '100%',
                      },
                    ]}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 5,
                          color: 'black',
                          fontFamily: 'Arimo-Regular',
                          opacity: 1,
                          textAlign: 'left',
                        }}>{`TOTAL AMOUNT`}</Text>
                    </View>
                    <View style={{ width: 'auto' }}>
                      <Text
                        style={{
                          fontSize: 5,
                          color: 'black',
                          fontFamily: 'Arimo-Regular',
                          opacity: 1,
                          textAlign: 'right',
                        }}>{`$0.00`}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.justifyContent,
                {
                  alignContent: 'center',
                  width: '100%',
                  flexDirection: 'column',
                },
              ]}>
              <View
                style={[
                  styles.justifyContent,
                  { alignItems: 'center', marginTop: 3 },
                ]}>
                <Text style={styles.textSmall}>
                  {`STATE OF TENNESSEE, TEST COUNTY`}
                </Text>
              </View>
              <View
                style={[
                  styles.justifyContent,
                  { alignItems: 'center' },
                ]}>
                <Text
                  style={{
                    fontSize: 7,
                    color: 'black',
                    fontFamily: 'Arimo-Bold',
                    opacity: 1,
                    fontWeight: 700,
                    textAlign: 'center',
                  }}>
                  {`TEST`}
                </Text>
              </View>
              <View
                style={[
                  styles.justifyContent,
                  { alignItems: 'center' },
                ]}>
                <Text
                  style={
                    styles.textSmall
                  }>{`REGISTER OF DEEDS`}</Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    );
};
