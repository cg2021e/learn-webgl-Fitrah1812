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
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    //define the shaders
    var vertexShaderSource = `
        attribute vec3 aPosition;
        attribute vec3 aColor;
        varying vec3 vColor;
        uniform mat4 Pmatrix;
        uniform mat4 Vmatrix;
        uniform mat4 Mmatrix;
        void main() {
            gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(aPosition, 1.0);
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
    
    var Pmatrix = gl.getUniformLocation(shaderProgram, "Pmatrix");
    var Vmatrix = gl.getUniformLocation(shaderProgram, "Vmatrix");
    var Mmatrix = gl.getUniformLocation(shaderProgram, "Mmatrix");
    // Start using the context (analogy: start using the paints and the brushes)
    // gl.useProgram(shaderProgram);

    // Teach the computer how to collect
    //  the positional values from ARRAY_BUFFER
    //  to each vertex being processed
    gl.bindBuffer(gl.ARRAY_BUFFER,vertex_buffer);
    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(
        aPosition, 
        3, 
        gl.FLOAT, 
        false, 
        0, 
        0
    );
    gl.enableVertexAttribArray(aPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER,vertex_buffer);
    var aColor = gl.getAttribLocation(shaderProgram, "aColor");
    gl.vertexAttribPointer(
        aColor, 
        3, 
        gl.FLOAT, 
        false, 
        0, 
        0
    );

    gl.enableVertexAttribArray(aColor);
    
    gl.useProgram(shaderProgram);

    //matrix
    function get_projection(angle, a, zMin, zMax){
        var ang = Math.tan*angle*0.5*Math.PI/180;
        return [
            0.5/ang, 0, 0, 0,
            0, 0.5/ang, 0, 0,
            0,0, -(zMax+zMin)/(zMax-zMin), 0,
            0, 0, 0, (-2*zMax*zMin)/(zMin-zMax)
        ];
    } 

    var proj_matrix = get_projection(40, canvas.width/canvas.clientHeight, 1, 100);
    var mo_matrix = [
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,0,0,1
    ];

    var view_matrix = [
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,0,0,1
    ];

    view_matrix[14] = view_matrix[14]-6;

    //rotation Process
    function rotateZ(m, angle){
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var mv0 = m[0], mv4=m[4], mv8 =m[8];

        m[0]= c*m[0]-s*m[1];
        m[4] =c*m[4]-s*m[5];
        m[8] = c*m[8]-s*m[9];

        m[1]= c*m[1]+s*mv0;
        m[5]= c*m[5]+s*mv4;
        m[9]= c*m[9]+s*mv8;

    }

    function rotateX(m, angle){
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var mv1 = m[1], mv5=m[5], mv9 =m[9];

        m[1]= c*m[1]-s*m[2];
        m[5] =c*m[5]-s*m[6];
        m[9] = c*m[9]-s*m[10];

        m[2]= c*m[2]+s*mv1;
        m[6]= c*m[6]+s*mv5;
        m[10]= c*m[10]+s*mv9;

    }

    function rotateY(m, angle){
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var mv0 = m[0], mv4=m[4], mv8 =m[8];

        m[0]= c*m[0]+s*m[2];
        m[4] =c*m[4]+s*m[6];
        m[8] = c*m[8]+s*m[10];

        m[2]= c*m[2]-s*mv0;
        m[6]= c*m[6]-s*mv4;
        m[10]= c*m[10]-s*mv8;

    }

    //drawing
    var wkt = 0;
    var animate = function(time){
        var dt = time -wkt;
        rotateZ(mo_matrix, dt* 0.005);
        rotateX(mo_matrix, dt* 0.002);
        rotateY(mo_matrix, dt* 0.003);

        wkt = time;
        gl.enable(gl.DEPTH_TEST);
    }

    // var freeze = false;
    // // Apply some interaction using mouse
    // function onMouseClick(event) {
    //     freeze = !freeze;
    // }
    // document.addEventListener("click", onMouseClick, false);
    // //var x and y
    // var speed = [3/600, 1/600];
    // // Create a uniform to animate the vertices
    // var uChange = gl.getUniformLocation(shaderProgram, "uChange");
    // var change = [0, 0];

    // function render() {
    //     if (!freeze) {
    //         change[0] = change[0] + speed[0];
    //         change[1] = change[1] + speed[1];
    //         gl.uniform2fv(uChange, change);
    //         gl.clearColor(0.1, 0.1, 0.1, 1.0);
    //         gl.clear(gl.COLOR_BUFFER_BIT);
    //         gl.drawArrays(gl.TRIANGLES, 0, 6);
    //     }
    //     requestAnimationFrame(render);
    // }
    // requestAnimationFrame(render);
}