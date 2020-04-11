import React from "react";
import {
  ActivityIndicator,
  Colors,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import axios from "axios";


export default class Cidade extends React.Component {
  // GOOD

  state = {
    cidade: "",
    temperatura: 0,
    probchuva: 0,
    humidade: 0,
    description: "",
    icon: "",
    sensacao: 0,
    nascersol: "",
    pordosol: "",
    isLoading: true,
    setLoading: true,
    vento: 0
  };

  componentDidMount() {
    this.loaddados(this.props.item.name)
    console.log("FUI CHAMADO")
  }

componentDidUpdate(props) {
  // Typical usage (don't forget to compare props):
  if (this.state.cidade !== this.props.item.name) {
    this.loaddados(this.props.item.name)
  }
}


  render() {
    return (
      <TouchableOpacity onPress={this.props.onEditPress}>
        {this.state.isLoading ? (
          <ActivityIndicator style={styles.loading} size="large" />
        ) : (
          <View style={styles.brazil_forecast_cities__city}>
            <View style={styles.brazil_forecast_cities__city_cont}>
    
              <View>
                <Text style={{ paddingLeft: 20, fontSize: 20, flex: 1 }}>
                  {this.props.item.name}
                </Text>
                <Text style={{ paddingLeft: 20, fontSize: 20, flex: 1 }}>
                  Temp: {this.state.temperatura}º C
                </Text>
              </View>
              <View>
                <Text style={{ paddingLeft: 20, fontSize: 15, flex: 3 }}>
                  Probalidade {"\n"}de chuva: {this.state.probchuva}%
                </Text>
                <Text style={{ paddingLeft: 20, fontSize: 15, flex: 3 }}>
                  Sensação termica: {this.state.sensacao}º C
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 0,
                  marginLeft: 0,
                  height: 50,
                  width: 50,
                }}
              >
                <MaterialCommunityIcons name="pencil" size={20} />
              </View>
            </View>
            <View style={styles.brazil_forecast_cities__city_cont_img}>
              <View>
                <Image
                source={{ uri: "http://openweathermap.org/img/wn/" +
                          this.state.icon +
                          "@2x.png" }}
  
                  style={{ width: 100, height: 100 }}
                />
                <Text style={{ fontSize: 20, flex: 3 }}>{this.state.description}</Text>
              </View>
              <View>
        
                <Text style={{ paddingLeft: 20, fontSize: 20, flex: 3 }}>
                  Humidade: {this.state.humidade} %
                </Text>
                 <Text style={{ paddingLeft: 20, fontSize: 20, flex: 3 }}>
                  Vento: {this.state.vento} Km/h
                </Text>
              </View>
       
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  loaddados = (thiscidade) => {
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?q=" +
          thiscidade +
          "&lang=pt_br&units=metric&APPID=31f835fafe8e52b246f01ab96effeab4"
      )
      .then((response) => {
        this.setState({
          cidade: thiscidade,
          temperatura: Math.round(response.data.main.temp),
          probchuva: Math.round(response.data.clouds.all),
          humidade: Math.round(response.data.main.humidity),
          description: response.data.weather[0].description,
          icon: response.data.weather[0].icon,
          sensacao: Math.round(response.data.main.feels_like),
          nascersol: response.data.sys.sunrise,
          pordosol: response.data.sys.sunset,
          vento: Math.round(response.data.wind.speed * 3.6)
        });
      })
      .catch((error) => console.error(error))
      .finally(() => this.setState({ isLoading: false }));
  }
}

const styles = StyleSheet.create({
  brazil_forecast_cities__city: {
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    marginTop: 10,
    height: 300,
    padding: 10,
    backgroundColor: "#FFF",
    borderColor: "#ddd",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    marginBottom: 2,
    padding: 2,
    width: "98%",
  },
  brazil_forecast_cities__city_cont: {
    flex: 1,
    flexDirection: "row",
  },
  brazil_forecast_cities__city_cont_img: {
    flex: 1,
    flexDirection: "row",
    //paddingLeft: 20,
  },
   loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100,
    bottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf:'center'
  }
});
