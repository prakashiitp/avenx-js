<state count="0" />

<action name="reset">
    count = 0;
</action>

<div>
    <@css container />
    <h1>Test-comp Component</h1>
    <p>Current count: {{ count }}</p>
    <button @click="count++">Increment</button>
    <button @click="reset()">Reset</button>
</div>
