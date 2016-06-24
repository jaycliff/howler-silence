/*global Howler*/
Howler.silence = (function (audioCtx) {
    "use strict";
    var channels = 2, // Stereo
        source,
        playing = false,
        channel,
        i,
        nowBuffering,
        frameCount = audioCtx.sampleRate * 2.0, // Create an empty two second stereo buffer at the sample rate of the AudioContext
        myAudioBuffer = audioCtx.createBuffer(channels, frameCount, audioCtx.sampleRate);
    for (channel = 0; channel < channels; channel += 1) {
        nowBuffering = myAudioBuffer.getChannelData(channel); // This gives us the actual ArrayBuffer that contains the data
        for (i = 0; i < frameCount; i += 1) {
            // Math.random() is in [0; 1.0]
            // audio needs to be in [-1.0; 1.0]
            //nowBuffering[i] = Math.random() * 2 - 1; // white noise
            nowBuffering[i] = 0; // Silence?
        }
    }
    return {
        isPlaying: function isPlaying() {
            return playing;
        },
        play: function play() {
            if (!playing) {
                playing = true;
                source = audioCtx.createBufferSource(); // This is the AudioNode to use when we want to play an AudioBuffer
                source.loop = true;
                source.buffer = myAudioBuffer; // set the buffer in the AudioBufferSourceNode
                source.connect(audioCtx.destination); // connect the AudioBufferSourceNode to the destination so we can hear the sound
                source.start(0); // start the source playing
            }
        },
        stop: function stop() {
            if (playing) {
                source.stop();
                playing = false;
            }
        }
    };
}(Howler.ctx));