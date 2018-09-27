<template lang="pug">
  v-content
    v-layout#hero
      v-flex.xs12.sm8
        h1 The New Mirror App , Feel a change.
        p カガミーは、あなたに合ったメイクアップ方法を提供するアプリです。めんどくさがりでも、いつもメイクをしなくても、突然メイクする必要があってもカガミーで新しいメイクアップを体験しましょう。
        v-btn(nuxt to="beginner" outline color="white") 初めてのチュートリアル
      #hashtag #カガミー　#ミラーアプリ #メイクアップ
    #partner
      p: nuxt-link(to="partner") カガミーのパートナーになりませんか？パートナー企業を募集しています。
    v-container#question
      h2
        span Question
        | いつもと違う、あなたに合うメイク知りたい？
      #chart
      small ※自社調べ 「いつもと違くても、あなたの顔に合ったメイク知りたいですか？」に回答した女性20~50台（N=600）を対象として調査
    v-container#problems
      h2
        span Problems
        | いつものお化粧に悩んでいませんか？
      v-layout(row wrap)
        v-flex(xs12 sm4)
          h3: span 正直メイクって面倒…
          p メイクって時間がかかるし、上手にできないって凹むことありすよね？
        v-flex(xs12 sm4)
          h3: span 分の顔に似合わない…
          p 雑誌や動画を見ても、本当に自分の顔に似合うかわからないですよね？
        v-flex(xs12 sm4)
          h3: span お店だと恥ずかしい…
          p ショップでメイク体験したいけど、イマイチ行く気にならないですよね？
    v-container#solution
      h2
        span solution
        | どうすればいい？
      v-layout(justify-space-around row wrap align-center)
        v-flex(xs12 sm4)
          span 
            i SPEED
            i UP
        v-flex(xs12 sm7)
          h3 時短テクを手に入れる
          p カガミーはメイクのための時短テクを提供します。眉毛の形が決まらない？チークのポイントがわからない？カガミーのフェイスガイドはあなたの顔に合わせたガイドラインを表示します。どの位置まで線を引くか、どこを中心にぼかすのかをピンポイントで教えてくれます。
      v-layout(justify-space-around row wrap reverse align-center)
        v-flex(xs12 sm4)
          span 
            i RECORD
            i &
            i REPEAT
        v-flex(xs12 sm7)
          h3 いいとき録画で簡単リピート顔
          p 毎日同じメイクをし続けるのが難しいかったり、週末だけメイクする場合など期間が空いてしまうとどうしてもメイクの手順を忘れがち。前のメイクを録画して再生しながらなぞれば一番グットな「いいとき」をリピートできます。
      v-layout(justify-space-around row wrap align-center)
          v-flex(xs12 sm4)
            span
              i SHOP+
          v-flex(xs12 sm7)
            h3 専用ネットショップからサンプルを注文
            p 化粧品サンプルを探すのも大変。スマホ・PCからアクセスできる専用サイトで同じ肌質の人が試した化粧品サンプルを見つけます。有料サンプルはカガミーポイントでの購入が可能です。
    v-container#start
      h2
        span where to start?
        | まずはiPadアプリをDL
      p ※現在アプリのダウンロードはモニター専用となっております。
      v-btn(round color="primary" dark to="/login") 事前会員登録はこちらから
    v-container#commune
      h2
        span Commune
        | 自分と似た人を見つけよう
      p カガミーコミューンに参加すると、アプリがあなたと似た形状の顔の人を教えてくれます。各グループにはメンターがつきいろいろな対処法を教えてくれます。自分に似た人を参考に悩みを解決しましょう。
    #share
      v-btn(v-for="share in shares" :key="share" icon) 
        v-icon {{ share }}
</template>

<script>
export default {
  data() {
    return {
      shares:[
        'fab fa-facebook',
        'fab fa-twitter',
        'fab fa-instagram',
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
  @keyframes textup {
      0% {
          opacity: 0;
          top: 1em;
      }
      100% {
          opacity: 1;
          top: 0;
      }
  }
  @keyframes updown {
      0% {
          top:0;
      }
      50%{
        top:5px;
      }
      100% {
          top:0;
      }
  }
  #hero{
    height: 72vh;
    background:#0e0e0e url('../assets/img/hero.jpg') no-repeat bottom right;
    background-size: contain;
    color: #fff;
    position: relative;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    flex-direction: column;
    justify-content: center;
    justify-content: flex-end;
    margin-bottom: 10px;
    padding-bottom: 40px;
    @media screen and (max-width: 400px) {
        background-size: cover;
        background-position: center;
    }
    h1{
      font-family: serif;
      font-size: 7vw;
      // width: 60%;
      animation: textup 1s ease-in-out;
      position: relative;
      line-height: 1;
      padding: 16px;
    }
    p{
      padding: 16px;
      // width: 60%;
      animation: textup 1s ease-in-out;
      position: relative;
    }
    #hashtag{
      position: absolute;
      bottom: -10px;
      right: 0;
      background: #fc3338;
      padding: 0.5em 1em;
      font-weight: bold;
    }
  }
  #partner{
    text-align: center
  }
  h2{
    text-align: center;
    font-size: 6vw;
    font-weight: normal;
    color: #000;
    font-family: serif;
    line-height: 1.2;
    margin: 0;
    margin-bottom: 36px;
    &:before{
      content: '';
      height: 50px;
      border-left: 1px solid #d2d2d2;
    }
    span{
      margin-top: 24px;
      margin-bottom: 16px;
      font-size: 20px;
      letter-spacing: -1px;
      font-family: 'Overpass';
      display: block;
      color: #d2d2d2;
    }
  }
  #chart{
    width: 160px;
    height: 160px;
    border-radius: 50%;
  }
  #problems{
    text-align: center;
    h3 {
      margin-bottom: 20px;
        position: relative;
        z-index: 0;
        &:before {
            opacity: 0.5;
            position: absolute;
            top: 0;
            left: 0;
            content: '';
            display: block;
            width: 100%;
            height: 100px;
            background: url('../assets/img/moya.png');
            background-repeat: no-repeat;
            background-position: center;
            background-size: 80px;
            animation: updown 1s ease-in-out infinite;
        }
        span {
            display: inline-block;
            margin-top: 2em;
            margin-bottom: 1em;
            position: relative;
            z-index: 1;
        }
    }
  }
  #solution{
      position: relative;
      z-index: 0;
      &::after {
          content: '';
          width: 150%;
          background: linear-gradient(to right, #129aec, #4ed5cb);
          position: absolute;
          top: 22%;
          left: -20%;
          height: 60%;
          transform: rotate(-10deg);
          z-index: -2;
      }
      h3{
        background: #000;
        color: #fff;
        padding: 0 0.5em;
        font-weight: normal;
        margin: 0;
        line-height: 1.2;
        padding: 0.3em;
        text-align: center;
        margin-bottom: 10px;
        @media screen and (min-width: 601px){
          text-align: left;
          font-size: 30px;
        }
      }
      .layout{
        @media screen and (min-width: 601px){
          min-height: 250px
        }
      }
      .flex span{
        background: white;
        color: #000;
        display: block;
        text-align:center;
        i{
          font-style: normal;
          display: inline-block;
        }
        @media screen and (min-width: 601px){
              font-size: 40px;
                background: transparent;
                max-width: 100%;
                display: -webkit-flex;
                display: -moz-flex;
                display: -ms-flex;
                display: -o-flex;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                text-align: center;
                color: #4ed5cb;
                line-height: 1;
                flex-direction: column;
                &:after {
                    position: absolute;
                    display: block;
                    content: '';
                    width: 100%;
                    padding-top: 88%;
                    background: #fff;
                    border-radius: 50%;
                    z-index: -1;
                    border: 13px double #4ed5cb;
                }
        }
      }
  }
  #start{
    text-align: center
  }
</style>
