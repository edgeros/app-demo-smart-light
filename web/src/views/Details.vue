<template>
  <div class="details">
    <van-nav-bar :title="light.alias" left-arrow @click-left="goBack()" />
    <van-row class="row" justify="center" align="center" type="flex">
      <van-col>
        <van-image
          :style="imgStyle"
          width="240"
          
          height="280"
          :src="light.imgUrl"
        />
      </van-col>
    </van-row>
    <van-row class="row" justify="center" align="center" type="flex">
      <van-col>
        <van-icon
          @click="lightControl()"
          size="32"
          color=" #1989fa"
          :name="require('../assets/svg/channel0.svg')"
        />
      </van-col>
    </van-row>
    <van-row class="row" type="flex">
      <van-col span="4">
        <h3>亮度</h3>
      </van-col>
      <van-col offset="1" span="18" class="center">
        <van-slider
          v-model="light.brightness"
          :min="1"
          :max="255"
          @change="changeBrightness()"
        >
          <template #button>
            <div class="custom-button bule">{{ light.brightness }}</div>
          </template>
        </van-slider>
      </van-col>
    </van-row>
    <van-row class="row" type="flex">
      <van-col span="4">
        <h3>色温</h3>
      </van-col>
      <van-col offset="1" span="18" class="center">
        <van-slider
          min="1"
          max="500"
          v-model="light.colorTemperature"
          active-color="#ee0a24"
          @change="changeColorTemperature()"
        >
          <template #button>
            <div class="custom-button red">{{ light.colorTemperature }}</div>
          </template>
        </van-slider>
      </van-col>
    </van-row>
  </div>
</template>
<script>
export default {
  name: "Details",
  data() {
    return {
      light: {
        devid: "",
        alias: "",
        channel0: false,
        brightness: 1,
        colorTemperature: 1,
        imgUrl: require("../assets/img/smart_light.png"),
        dark: "#92949c",
      },
      imgStyle: {
        backgroundColor: "#92949c",
      },
    };
  },
  methods: {
    goBack() {
      this.$router.push({ name: "Home" });
    },
    initParams() {
      this.light.devid = this.$route.params.devid;
      this.light.alias = this.$route.params.alias;
    },
    initLightStatus() {
      if (this.light.channel0) {
        const rgb = this.cct2rgb(this.light.colorTemperature);
        console.log(rgb);
        const color = this.RGBToHex(rgb);
        console.log(color);
        if (color !== -1) {
          console.log(this.imgStyle);
          this.imgStyle.backgroundColor = color;
        }
      } else {
        this.imgStyle.backgroundColor = this.light.dark;
      }
    },
    initSocket() {
      this.$socket.$subscribe("light-message", (msg) => {
        console.log(msg);
        if (msg.channel0 !== undefined) {
          this.light.channel0 = msg.channel0;
        }
        if (msg.brightness !== undefined) {
          this.light.brightness = msg.brightness;
        }
        if (msg.colorTemperature !== undefined) {
          this.light.colorTemperature = msg.colorTemperature;
        }
        this.initLightStatus();
      });
      this.$socket.$subscribe("light-lost", (devid) => {
        if (devid === this.light.devid) {
          this.goBack();
        }
      });
    },
    lightControl() {
      this.$socket.client.emit("light-control", {
        channel0: !this.light.channel0,
      });
    },
    changeBrightness() {
      if (this.light.channel0) {
        this.$socket.client.emit("light-control", {
          brightness: this.light.brightness,
        });
      }
    },
    changeColorTemperature() {
      if (this.light.channel0) {
        this.$socket.client.emit("light-control", {
          colorTemperature: this.light.colorTemperature,
        });
      }
    },

    cct2rgb(cct) {
      // 2700k 对应 rgb
      const rgbMin = [255, 169, 87];
      // 6500k 对应 rgb
      const rgbMax = [255, 249, 251];
      const cctMin = 1;
      const cctMax = 500;
      const k = (cct - cctMax) / (cctMin - cctMax);
      const r = rgbMin[0] * (1 - k) + rgbMax[0] * k;
      const g = rgbMin[1] * (1 - k) + rgbMax[1] * k;
      const b = rgbMin[2] * (1 - k) + rgbMax[2] * k;
      return [Math.round(r), Math.round(g), Math.round(b)];
    },
    RGBToHex(rgb) {
      if (
        rgb[0] >= 0 &&
        rgb[0] <= 255 &&
        rgb[1] >= 0 &&
        rgb[1] <= 255 &&
        rgb[2] >= 0 &&
        rgb[2] <= 255
      ) {
        return (
          "#" +
          (rgb[0].toString(16).length < 2
            ? "0" + rgb[0].toString(16)
            : rgb[0].toString(16)) +
          (rgb[1].toString(16).length < 2
            ? "0" + rgb[1].toString(16)
            : rgb[1].toString(16)) +
          (rgb[2].toString(16).length < 2
            ? "0" + rgb[2].toString(16)
            : rgb[2].toString(16))
        );
      } else {
        return -1;
      }
    },
  },
  created() {
    this.initParams();
    this.initSocket();
    this.initLightStatus();
  },
};
</script>

<style scoped>
.custom-button {
  width: 26px;
  color: #fff;
  font-size: 10px;
  line-height: 18px;
  text-align: center;
  border-radius: 100px;
}

.bule {
  background-color: #1989fa;
}

.red {
  background-color: #ee0a24;
}
.row {
  margin-top: 10px;
}

.center {
  align-items: center;
  justify-content: center;
  display: flex;
}
</style>