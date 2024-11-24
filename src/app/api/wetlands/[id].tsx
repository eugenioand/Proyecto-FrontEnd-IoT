const result = {
    id: 1,
    name: "Everglades Wetland",
    location: "Florida, USA",
    status: "good",
    nodes: [
        {
            id: "node1",
            sensors: [{
                name: "Water Level Sensor",
                sensor_code: "WL1",
                unity: "m",
                value: 1.5,
                max: 3.0,
                latitude: 25.7617,
                longitude: -80.1918
            }],
            latitude: 25.7617,
            longitude: -80.1918,
            status: "good"
        },
        {
            id: "node2",
            sensors: [{
                name: "Temperature Sensor",
                sensor_code: "T1",
                unity: "°C",
                value: 22.5,
                max: 35.0,
                latitude: 25.7617,
                longitude: -80.1918
            }],
            latitude: 25.7617,
            longitude: -80.1918,
            status: "warning"
        },
        {
            id: "node3",
            sensors: [{
                name: "pH Sensor",
                sensor_code: "PH1",
                unity: "",
                value: 7.2,
                max: 14.0,
                latitude: 25.7617,
                longitude: -80.1918
            }],
            status: "alert",
            latitude: 25.7617,
            longitude: -80.1918
        },
    ]
};
// setWetland(result);