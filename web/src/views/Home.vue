<template>
  <div class="home">
    <van-nav-bar title="设备列表" class="safe-area-top"/>
    <van-pull-refresh
      style="min-height: 100vh"
      v-model="isLoading"
      @refresh="onRefresh"
    >
      <van-list style="min-height: 100vh">
        <van-cell
          v-for="(light, index) of lights"
          :title="light.alias"
          :label="light.devid"
          :key="index"
          is-link="true"
          center="true"
          @click="getLightDetail(light)"
        >
          <template #icon>
            <van-image
              class="img"
              width="50"
              height="50"
              :src="require('../assets/img/smart_light.png')"
            />
          </template>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      lights: [],
      isLoading: false,
    };
  },
  sockets: {
    connect() {
      this.getLightList();
      console.log("socket connected");
    },
    connectError() {
      console.log("socket connect error");
    },
    connectTimeout() {
      console.log("socket connect timeout");
    },
    error() {
      console.log("error");
    },
    disconnect() {
      console.log("socket disconnect");
    },
  },
  methods: {
    onRefresh() {
      setTimeout(() => {
        this.isLoading = false;
        this.getLightList();
      }, 1000);
    },
    initSocket() {
      this.$socket.$subscribe("light-lost", (devid) => {
        this.$notify({ type: "primary", message: `${devid} 设备已下线` });
        this.lights = this.lights.filter((light) => {
          return light.devid !== devid;
        });
      });
      this.$socket.$subscribe("light-join", (light) => {
        this.$notify({
          type: "primary",
          message: `新上线了 ${light.alias} 设备`,
        });
        this.lights.push(light);
      });
      this.$socket.$subscribe("light-error", (error) => {
        if (error.code === 50002) {
          this.$notify({ type: "danger", message: `无效设备！` });
        } else {
          this.$notify({ type: "danger", message: error.message });
        }
      });
    },
    getLightList() {
      this.$socket.client.emit("light-list", (data) => {
        this.lights = data;
        if (this.lights.length === 0) {
          this.$notify({ type: "danger", message: `未发现设备！` });
        }
      });
    },
    getLightDetail(light) {
      this.$socket.client.emit("light-select", light.devid, (data) => {
        if (data.result) {
          this.$router.push({ name: "Details", params: light });
        } else {
          if (data.code === 50004) {
            this.$notify({ type: "danger", message: `你没有此设备权限！` });
          } else {
            this.$notify({ type: "danger", message: `未知错误！` });
          }
        }
      });
    },
  },
  created() {
    this.initSocket();
    this.getLightList();
  },
};
</script>

<style scoped>
.img {
  background-color: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);
}
</style>
