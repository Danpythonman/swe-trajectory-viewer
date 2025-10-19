import { TRAJECTORY_VIEWER } from './ids';
import { TRAJECTORY_ELEMENT } from './classes';

interface Trajectory {
    action: string;
    observation: string;
    response: string;
    thought: string;
    execution_time: string;
    state: string;
}

interface TrajectoryWrapper {
    trajectory: Trajectory[];
    history: object;
    info: object;
    replay_config: object;
    environment: object;
}

function renderSingleTrajectoryElement(trajectoryViewer: HTMLElement, t: Trajectory, i: number) {
    const d = document.createElement('div');
    const stepNumber = document.createElement('h2');
    const thoughtHeading = document.createElement('h3');
    const thoughtDescription = document.createElement('p');
    const thoughtOutput = document.createElement('pre');
    const actionHeading = document.createElement('h3');
    const actionDescription = document.createElement('p');
    const actionOutput = document.createElement('pre');
    const observationHeading = document.createElement('h3');
    const observationDescription = document.createElement('p');
    const observationOutput = document.createElement('pre');

    stepNumber.innerText = `Step ${i}`;
    thoughtHeading.innerText = '💭 Thought';
    thoughtDescription.innerText = 'This is the model\'s thought process from reading the output of the previous command and before executing the next action.';
    thoughtOutput.innerText = t.thought;
    actionHeading.innerText = '🔧 Action';
    actionDescription.innerText = 'This is the command that the model gives to the SWE-Agent agent-computer interface to execute.';
    actionOutput.innerText = t.action;
    observationHeading.innerText = '👁️ Observation';
    observationDescription.innerText = 'This is the output of the command given by the agent once executed and processed by the SWE-Agent agent-computer interface.';
    observationOutput.innerText = t.observation;

    d.classList.add(TRAJECTORY_ELEMENT)
    thoughtOutput.classList.add('trajectory-element-thought');
    actionOutput.classList.add('trajectory-element-action');
    observationOutput.classList.add('trajectory-element-observation');

    d.appendChild(stepNumber);
    d.appendChild(thoughtHeading);
    d.appendChild(thoughtDescription);
    d.appendChild(thoughtOutput);
    d.appendChild(actionHeading);
    d.appendChild(actionDescription);
    d.appendChild(actionOutput);
    d.appendChild(observationHeading);
    d.appendChild(observationDescription);
    d.appendChild(observationOutput);
    trajectoryViewer.appendChild(d);
}

export function render(s: string) {
    const trajectoryViewer = document.getElementById(TRAJECTORY_VIEWER);
    if (!trajectoryViewer) {
        console.error('Trajectory viewer element does not exist');
        return;
    }
    try {
        const obj = JSON.parse(s) as TrajectoryWrapper;
        for (let i = 0; i < obj.trajectory.length; i++) {
            try {
                renderSingleTrajectoryElement(trajectoryViewer, obj.trajectory[i], i);
            } catch (error) {
                alert('Malformed trajectory elements.')
            }
        }
    } catch (error) {
        alert('Error parsing JSON.')
    }
}
