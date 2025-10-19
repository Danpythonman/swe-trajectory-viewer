import argparse
from dataclasses import dataclass
import json
from pathlib import Path
import typing


class Content(typing.TypedDict):
    type: str
    text: str
    cache_control: typing.Any


class Query(typing.TypedDict):
    role: str
    content: str | typing.List[Content]
    agent: str
    message_type: str


class Trajectory(typing.TypedDict):
    action: str
    observation: str
    response: str
    thought: str
    execution_time: str
    state: str
    query: typing.List[Query]


class TrajectoryWrapper(typing.TypedDict):
    trajectory: typing.List[Trajectory]
    history: typing.Any
    info: typing.Any
    replay_config: typing.Any
    environment: typing.Any


def read_trajectory_file(trajectory_filepath: Path) -> TrajectoryWrapper:
    with open(trajectory_filepath, 'r') as f:
        trajectory_json = json.load(f)
        return typing.cast(TrajectoryWrapper, trajectory_json)


def trajectory_to_conversation(trajectory_wrapper: TrajectoryWrapper) -> str:
    s = ''

    s += '🖥️ System:\n'
    s += trajectory_wrapper['trajectory'][0]['query'][0]['content']
    s += '\n\n🙋 User:\n'
    s += trajectory_wrapper['trajectory'][0]['query'][1]['content'][0]['text']

    for trajectory in trajectory_wrapper['trajectory']:
        s += '\n\n💭 Thought:\n'
        s += trajectory['thought']
        s += '\n\n🔧 Action:\n'
        s += trajectory['action']
        s += '\n\n 👁️ Observation:\n'
        s += trajectory['observation']

    return s


def write_conversation_to_file(trajectory_filepath: Path, conversation: str) -> None:
    trajectory_dir = trajectory_filepath.parent
    trajectory_conversation_filepath = trajectory_dir / f'{trajectory_filepath.stem}.conversation.txt'
    with open(trajectory_conversation_filepath, 'w') as f:
        f.write(conversation)


def convert_all_trajectories(dir: Path):
    for trajectory_filepath in dir.rglob('*.traj'):
        trajectory_wrapper = read_trajectory_file(trajectory_filepath)
        conversation = trajectory_to_conversation(trajectory_wrapper)
        write_conversation_to_file(trajectory_filepath, conversation)


@dataclass
class Args:
    directory: Path


def parse_args() -> Args:
    parser = argparse.ArgumentParser(
        description='Convert .traj files to conversational .txt files recursively in a directory.'
    )

    parser.add_argument(
        'directory',
        type=Path,
        help='Path to directory containing .traj files'
    )

    namespace = parser.parse_args()
    args = Args(**vars(namespace))

    if not args.directory:
        raise Exception('dictionary option not specified')

    if not args.directory.is_dir():
        parser.error(f'{args.directory} is not a directory')

    return args


def main():
    args = parse_args()
    convert_all_trajectories(args.directory)


if __name__ == '__main__':
    main()
