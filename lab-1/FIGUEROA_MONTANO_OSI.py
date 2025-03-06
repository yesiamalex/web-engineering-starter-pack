# Figueroa, Montano
# CMSC 126 - C, 2nd Sem 2024-2025

# OSI Model Layers Implementation
class ApplicationLayer:
    def process_data(self, data):
        print(f'Application Layer: Processing data "{data}"')
        return data

class PresentationLayer:
    def translate_data(self, data):
        print(f'Presentation Layer: Translating data "{data}"')
        return data

class SessionLayer:
    def manage_session(self, data):
        print(f'Session Layer: Managing session for data "{data}"')
        return data

class TransportLayer:
    def ensure_reliable_transport(self, data):
        print(f'Transport Layer: Ensuring reliable transport for data "{data}"')
        return data

class NetworkLayer:
    def route_data(self, data):
        print(f'Network Layer: Routing data "{data}"')
        return data

class DataLinkLayer:
    def format_frames(self, data):
        print(f'Data Link Layer: Formatting frames for data "{data}"')
        return data

class PhysicalLayer:
    def transmit_bits(self, data):
        print(f'Physical Layer: Transmitting bits for data "{data}"')
        return data

# Simulate data transmission through all 7 layers
def osi_model_simulation(data):
    app_layer = ApplicationLayer()
    pres_layer = PresentationLayer()
    sess_layer = SessionLayer()
    trans_layer = TransportLayer()
    net_layer = NetworkLayer()
    data_link_layer = DataLinkLayer()
    phys_layer = PhysicalLayer()

    # Data goes down the layers
    print(f'Data "{data}" is now set for parsing!')

    data = app_layer.process_data(data)
    data = pres_layer.translate_data(data)
    data = sess_layer.manage_session(data)
    data = trans_layer.ensure_reliable_transport(data)
    data = net_layer.route_data(data)
    data = data_link_layer.format_frames(data)
    data = phys_layer.transmit_bits(data)

    print(f'Data "{data}" successfully transmitted!')

# Example usage
osi_model_simulation("Hello, OSI!")
