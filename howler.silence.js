/*global Howler*/
/*
    ISSUE:
        sound won't seem to loop forever (sound will 'stop' playing, and will only resume when another sound is played)
        possible reason may be due to Howler's setup. A set timer could possibly halt sounds when not created in the usual Howler-way
        UPDATE: Howler._autoSuspend();
*/
Howler.silence = (function (Howler, audioCtx) {
    "use strict";
    var target = Howler.masterGain,
        autoresume_id,
        channels = 2, // Stereo
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
    function activateContext() {
        Howler._autoResume();
        autoresume_id = setTimeout(activateContext, 1000);
    }
    return {
        connect: function connect(node) {
            target = node;
            return this;
        },
        isPlaying: function isPlaying() {
            return playing;
        },
        play: function play() {
            if (!playing) {
                playing = true;
                source = audioCtx.createBufferSource(); // This is the AudioNode to use when we want to play an AudioBuffer
                source.loop = true;
                source.buffer = myAudioBuffer; // set the buffer in the AudioBufferSourceNode
                source.connect(target); // connect the AudioBufferSourceNode to the destination so we can hear the sound
                source.start(0); // start the source playing
                activateContext();
            }
            return this;
        },
        stop: function stop() {
            if (playing) {
                source.stop();
                playing = false;
                clearTimeout(autoresume_id);
                Howler._autoSuspend();
            }
            return this;
        }
    };
}(Howler, Howler.ctx));