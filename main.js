function main() {
    //Access the canvas through DOM: Document Object Model
    var canvas = document.getElementById('myCanvas');   // The paper
    var gl = canvas.getContext('webgl');                // The brush and the paints
    // const canvas = document.querySelector('.myCanvas');
    // const width = canvas.width = window.innerWidth;
    // const height = canvas.height = window.innerHeight;
    var vertices = [
        // -0.5, -0.5, 0.0, 1.0, 0.0,     // Point A
        //  0.5, -0.5, 0.0, 0.0, 1.0,     // Point B
        //  0.5,  0.5, 1.0, 0.0, 0.0,     // Point C

        //  0.5,  0.5, 1.0, 0.0, 0.0,     // Point C
        // -0.5,  0.5, 1.0, 0.0, 0.0,     // Point D
        // -0.5, -0.5, 0.0, 1.0, 0.0      // Point A
        //sisi A
        -1, -1, -1, 
         1, -1, -1,
         1,  1, -1,
        -1,  1, -1,

        //Sisi B
        -1, -1, 1, 
         1, -1, 1,
         1,  1, 1,
        -1,  1, 1,

        //Sisi C
        -1, -1, -1,
        -1,  1, -1,
        -1,  1,  1,
        -1, -1,  1,

        //Sisi D
        1, -1, -1,
        1,  1, -1,
        1,  1,  1,
        1, -1,  1,

        //Sisi E
        -1, -1, -1,
        -1, -1,  1,
         1, -1,  1,
         1, -1, -1,

        //Sisi F
        -1, 1, -1,
        -1, 1,  1,
         1, 1,  1,
         1, 1, -1,

    ];
    
    var colors =[
        //Sisi A
        0, 0, 1, 
        0, 0, 1,
        0, 0, 1, 
        0, 0, 1,

        //Sisi B
        1, 1, 0, 
        1, 1, 0,
        1, 1, 0, 
        1, 1, 0,

        //Sisi C
        0, 1, 0, 
        0, 1, 0,
        0, 1, 0, 
        0, 1, 0,

        //Sisi D
        1, 0, 0, 
        1, 0, 0,
        1, 0, 0, 
        1, 0, 0,

        //Sisi E
        0, 1, 1, 
        0, 1, 1,
        0, 1, 1, 
        0, 1, 1,

        //Sisi F
        1, 1, 0, 
        1, 1, 0,
        1, 1, 0, 
        1, 1, 0,

    ];

    var indices = [
        0, 1, 2, 
        0, 2, 3,
        4, 5, 6,
        4, 6, 7,

        8,   9, 10,
        8,  10, 11,
        12, 13, 14,
        12, 14, 15,

        16, 17, 18,
        16, 18, 19,
        20, 21, 22,
        20, 22, 23,
    ];

    // Create a linked-list for storing the vertices data
    var vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Create a linked-list for storing the vertices data
    var color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);


    // Create a linked-list for storing the vertices data
    var index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, index_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


    var vertexShaderSource = `
        attribute vec2 aPosition;
        attribute vec3 aColor;
        varying vec3 vColor;
        uniform vec2 uChange;
        void main() {
            gl_PointSize = 10.0;
            gl_Position = vec4(aPosition + uChange, 0.0, 1.0);
            vColor = aColor;
        }
    `;

    var fragmentShaderSource = `
        precision mediump float;
        varying vec3 vColor;
        void main() {
            gl_FragColor = vec4(vColor, 1.0);    // Yellow
        }
    `;

    // Create .c in GPU
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);

    // Compile .c into .o
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    // Prepare a .exe shell (shader program)
    var shaderProgram = gl.createProgram();

    // Put the two .o files into the shell
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    // Link the two .o files, so together they can be a runnable program/context.
    gl.linkProgram(shaderProgram);

    // Start using the context (analogy: start using the paints and the brushes)
    gl.useProgram(shaderProgram);

    // Teach the computer how to collect
    //  the positional values from ARRAY_BUFFER
    //  to each vertex being processed
    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(
        aPosition, 
        2, 
        gl.FLOAT, 
        false, 
        5 * Float32Array.BYTES_PER_ELEMENT, 
        0
    );
    gl.enableVertexAttribArray(aPosition);
    var aColor = gl.getAttribLocation(shaderProgram, "aColor");
    gl.vertexAttribPointer(
        aColor, 
        3, 
        gl.FLOAT, 
        false, 
        5 * Float32Array.BYTES_PER_ELEMENT, 
        2 * Float32Array.BYTES_PER_ELEMENT
    );
    gl.enableVertexAttribArray(aColor);

    var freeze = false;
    // Apply some interaction using mouse
    function onMouseClick(event) {
        freeze = !freeze;
    }
    document.addEventListener("click", onMouseClick, false);
    //var x and y
    var speed = [3/600, 1/600];
    // Create a uniform to animate the vertices
    var uChange = gl.getUniformLocation(shaderProgram, "uChange");
    var change = [0, 0];

    function render() {
        if (!freeze) {
            change[0] = change[0] + speed[0];
            change[1] = change[1] + speed[1];
            gl.uniform2fv(uChange, change);
            gl.clearColor(0.1, 0.1, 0.1, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}