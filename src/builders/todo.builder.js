export class TodoBuilder {
  constructor() {
    this.title = 'Default Todo';
    this.description = 'Default Description';
    this.doneStatus = false;
  }

  withTitle(title) {
    this.title = title;
    return this;
  }

  withDescription(description) {
    this.description = description;
    return this;
  }

  withStatus(done) {
    this.doneStatus = done;
    return this;
  }

  build() {
    return {
      title: this.title,
      description: this.description,
      doneStatus: this.doneStatus,
    };
  }
}